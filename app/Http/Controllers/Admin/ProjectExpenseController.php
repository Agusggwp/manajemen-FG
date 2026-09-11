<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectExpense;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class ProjectExpenseController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $expense = $project->expenses()->create([
            'name' => $validated['name'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'created_by' => auth()->id(),
        ]);

        ActivityLogger::log('CREATED', 'EXPENSE', "Pengeluaran '{$expense->name}' (Rp " . number_format($expense->amount, 0, ',', '.') . ") ditambahkan ke project '{$project->project_name}'.", $expense->id);

        return back()->with('success', "Biaya operasional '{$expense->name}' berhasil ditambahkan.");
    }

    public function destroy(ProjectExpense $expense)
    {
        $name = $expense->name;
        $expense->delete();

        ActivityLogger::log('DELETED', 'EXPENSE', "Pengeluaran '{$name}' dihapus dari project.", $expense->id);

        return back()->with('success', "Biaya operasional '{$name}' berhasil dihapus.");
    }
}
