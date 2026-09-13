<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\SystemSetting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $portfolios = Portfolio::ordered()->get();

        $portfolioSettings = [
            'public_portfolio_section_title' => SystemSetting::get('public_portfolio_section_title', 'Galeri Portofolio & Perlengkapan Studio'),
            'public_portfolio_section_subtitle' => SystemSetting::get('public_portfolio_section_subtitle', 'Dokumentasi eksklusif karya fotografi & kelengkapan studio ARTDEVATA'),
            'public_portfolio_show' => SystemSetting::get('public_portfolio_show', 'true'),
        ];

        return Inertia::render('Admin/Portfolios/Index', [
            'portfolios' => $portfolios,
            'portfolioSettings' => $portfolioSettings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120', // Max 5MB
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $imagePath = $validated['image'] ?? '/images/pawiwahan.jpeg';

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('portfolios', 'public');
            $imagePath = $path;
        }

        $nextSortOrder = $validated['sort_order'] ?? ((Portfolio::max('sort_order') ?? 0) + 1);

        $portfolio = Portfolio::create([
            'category' => strtoupper(trim($validated['category'])),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'sort_order' => $nextSortOrder,
            'is_active' => $request->boolean('is_active', true),
        ]);

        ActivityLogger::log('CREATED', 'PORTFOLIO', "Portofolio slide '{$portfolio->title}' ({$portfolio->category}) berhasil ditambahkan.", $portfolio->id);

        return back()->with('success', "Item portofolio '{$portfolio->title}' berhasil ditambahkan.");
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120', // Max 5MB
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = [
            'category' => strtoupper(trim($validated['category'])),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $portfolio->sort_order,
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->hasFile('image_file')) {
            // Delete old file if stored in public storage
            if ($portfolio->image && !str_starts_with($portfolio->image, '/') && !str_starts_with($portfolio->image, 'http')) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $path = $request->file('image_file')->store('portfolios', 'public');
            $data['image'] = $path;
        } elseif (!empty($validated['image'])) {
            $data['image'] = $validated['image'];
        }

        $portfolio->update($data);

        ActivityLogger::log('UPDATED', 'PORTFOLIO', "Portofolio slide '{$portfolio->title}' berhasil diperbarui.", $portfolio->id);

        return back()->with('success', "Item portofolio '{$portfolio->title}' berhasil diperbarui.");
    }

    public function destroy(Portfolio $portfolio)
    {
        $title = $portfolio->title;

        if ($portfolio->image && !str_starts_with($portfolio->image, '/') && !str_starts_with($portfolio->image, 'http')) {
            Storage::disk('public')->delete($portfolio->image);
        }

        $portfolio->delete();

        ActivityLogger::log('DELETED', 'PORTFOLIO', "Portofolio slide '{$title}' berhasil dihapus.");

        return back()->with('success', "Item portofolio '{$title}' berhasil dihapus.");
    }

    public function toggleStatus(Portfolio $portfolio)
    {
        $portfolio->is_active = !$portfolio->is_active;
        $portfolio->save();

        $statusText = $portfolio->is_active ? 'diaktifkan' : 'dinonaktifkan';
        ActivityLogger::log('UPDATED', 'PORTFOLIO', "Status portofolio slide '{$portfolio->title}' {$statusText}.", $portfolio->id);

        return back()->with('success', "Status portofolio '{$portfolio->title}' berhasil {$statusText}.");
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:portfolios,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            Portfolio::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        ActivityLogger::log('UPDATED', 'PORTFOLIO', 'Urutan slide galeri portofolio diperbarui.');

        return back()->with('success', 'Urutan slide portofolio berhasil disimpan.');
    }

    public function updateSectionSettings(Request $request)
    {
        $validated = $request->validate([
            'public_portfolio_section_title' => 'nullable|string|max:255',
            'public_portfolio_section_subtitle' => 'nullable|string|max:500',
            'public_portfolio_show' => 'nullable|string|in:true,false',
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) ($value ?? '')]
            );
        }

        ActivityLogger::log('UPDATED', 'PORTFOLIO', 'Pengaturan section Galeri Portofolio publik diperbarui.');

        return back()->with('success', 'Pengaturan tampilan galeri portofolio berhasil disimpan.');
    }
}
