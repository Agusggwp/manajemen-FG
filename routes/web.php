<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\MuaController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PhotoPackageController;
use App\Http\Controllers\Admin\PhotographerController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ProjectExpenseController;
use App\Http\Controllers\Admin\ProofValidationController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ScheduleController as AdminScheduleController;
use App\Http\Controllers\Admin\DevToolController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Photographer\DashboardController as PhotographerDashboardController;
use App\Http\Controllers\Photographer\GalleryController as PhotographerGalleryController;
use App\Http\Controllers\Photographer\ProjectController as PhotographerProjectController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Photographer\ProofController as PhotographerProofController;
use App\Http\Controllers\Photographer\SalaryController as PhotographerSalaryController;
use App\Http\Controllers\Photographer\ScheduleController as PhotographerScheduleController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Public Root Route (Photo Packages Catalog)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/public/log-consent', [HomeController::class, 'logConsent'])->name('public.log-consent');

// Authentication Routes
Route::redirect('/admin/login', '/login');
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Forgot & Reset Password Routes
Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// ADMIN ROUTES
Route::middleware(['auth', 'role.admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Master Photo Packages
    Route::post('/packages/{package}/duplicate', [PhotoPackageController::class, 'duplicate'])->name('packages.duplicate');
    Route::patch('/packages/{package}/toggle-status', [PhotoPackageController::class, 'toggleStatus'])->name('packages.toggle-status');
    Route::resource('packages', PhotoPackageController::class)->except(['create', 'edit']);

    // Galeri Portofolio & Perlengkapan Studio (Landing Page)
    Route::patch('/portfolios/{portfolio}/toggle-status', [PortfolioController::class, 'toggleStatus'])->name('portfolios.toggle-status');
    Route::post('/portfolios/reorder', [PortfolioController::class, 'reorder'])->name('portfolios.reorder');
    Route::post('/portfolios/section-settings', [PortfolioController::class, 'updateSectionSettings'])->name('portfolios.section-settings');
    Route::resource('portfolios', PortfolioController::class)->except(['create', 'edit', 'show']);

    // Master MUA
    Route::resource('muas', MuaController::class)->except(['create', 'edit']);

    // Master Photographers
    Route::resource('photographers', PhotographerController::class)->except(['create', 'edit']);

    // Master Customers
    Route::resource('customers', CustomerController::class)->except(['create', 'edit']);

    // Schedules (WAJIB LOKASI)
    Route::post('/schedules/{schedule}/send-reminder', [AdminScheduleController::class, 'sendReminder'])->name('schedules.send-reminder');
    Route::resource('schedules', AdminScheduleController::class);

    // Projects
    Route::patch('/projects/{project}/status', [AdminProjectController::class, 'updateStatus'])->name('projects.update-status');
    Route::patch('/projects/{project}/work-duration', [AdminProjectController::class, 'updateWorkDuration'])->name('projects.update-work-duration');
    Route::post('/projects/{project}/photographers', [AdminProjectController::class, 'addPhotographer'])->name('projects.add-photographer');
    Route::delete('/projects/{project}/photographers/{photographer}', [AdminProjectController::class, 'removePhotographer'])->name('projects.remove-photographer');
    Route::post('/projects/{project}/muas', [AdminProjectController::class, 'addMua'])->name('projects.add-mua');
    Route::delete('/projects/{project}/muas/{mua}', [AdminProjectController::class, 'removeMua'])->name('projects.remove-mua');
    Route::post('/projects/{project}/expenses', [ProjectExpenseController::class, 'store'])->name('projects.add-expense');
    Route::delete('/expenses/{expense}', [ProjectExpenseController::class, 'destroy'])->name('expenses.destroy');
    Route::resource('projects', AdminProjectController::class);

    // Photo Proof Validation
    Route::get('/proofs', [ProofValidationController::class, 'index'])->name('proofs.index');
    Route::post('/proofs/{proof}/validate', [ProofValidationController::class, 'validateProof'])->name('proofs.validate');

    // Payments (Salaries & MUA Fees)
    Route::get('/payments/salaries', [PaymentController::class, 'photographerSalaries'])->name('payments.salaries');
    Route::post('/payments/salaries/{salary}/pay', [PaymentController::class, 'markSalaryPaid'])->name('payments.salaries.pay');
    Route::get('/payments/mua-fees', [PaymentController::class, 'muaFees'])->name('payments.mua-fees');
    Route::post('/payments/mua-fees/{fee}/pay', [PaymentController::class, 'markMuaFeePaid'])->name('payments.mua-fees.pay');

    // Reports
    Route::get('/reports/package-profit', [ReportController::class, 'packageProfit'])->name('reports.package-profit');
    Route::get('/reports/package-profit/export-csv', [ReportController::class, 'exportCsv'])->name('reports.package-profit.export-csv');

    // Activity Logs & Settings
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/test-discord', [SettingsController::class, 'testDiscord'])->name('settings.test-discord');

    // Dev Tools (Web Migration & System Maintenance)
    Route::get('/dev-tools', [DevToolController::class, 'index'])->name('dev-tools.index');
    Route::post('/dev-tools/execute', [DevToolController::class, 'execute'])->name('dev-tools.execute');
});

// PHOTOGRAPHER ROUTES
Route::middleware(['auth', 'role.photographer'])->prefix('photographer')->as('photographer.')->group(function () {
    Route::get('/dashboard', [PhotographerDashboardController::class, 'index'])->name('dashboard');

    // Own Schedules & Projects
    Route::get('/schedules', [PhotographerScheduleController::class, 'index'])->name('schedules.index');
    Route::get('/schedules/{schedule}', [PhotographerScheduleController::class, 'show'])->name('schedules.show');

    Route::get('/projects', [PhotographerProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}', [PhotographerProjectController::class, 'show'])->name('projects.show');

    // Proof Submissions
    Route::get('/schedules/{schedule}/proof/{type}', [PhotographerProofController::class, 'create'])->name('proofs.create');
    Route::post('/schedules/{schedule}/proof', [PhotographerProofController::class, 'store'])->name('proofs.store');

    // Gallery & Salary
    Route::get('/gallery', [PhotographerGalleryController::class, 'index'])->name('gallery.index');
    Route::post('/projects/{project}/gallery', [PhotographerGalleryController::class, 'store'])->name('gallery.store');

    Route::get('/salary', [PhotographerSalaryController::class, 'index'])->name('salary.index');
});
