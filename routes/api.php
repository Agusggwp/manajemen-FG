<?php

use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Catalog & Inquiry API Routes
|--------------------------------------------------------------------------
|
| These endpoints are public and designed to be consumed by external websites
| (e.g. landing pages, marketing websites, mobile apps) with full CORS support.
|
*/

Route::prefix('v1')->group(function () {
    // Packages
    Route::get('/packages', [PublicApiController::class, 'getPackages'])->name('api.packages.index');
    Route::get('/packages/{id}', [PublicApiController::class, 'getPackageDetail'])->name('api.packages.show');

    // Categories
    Route::get('/categories', [PublicApiController::class, 'getCategories'])->name('api.categories.index');

    // Portfolio Gallery
    Route::get('/portfolios', [PublicApiController::class, 'getPortfolios'])->name('api.portfolios.index');

    // Site & Business Settings
    Route::get('/settings', [PublicApiController::class, 'getSettings'])->name('api.settings.index');

    // Inquiries / Booking reservations
    Route::post('/inquiries', [PublicApiController::class, 'createInquiry'])->name('api.inquiries.store');

    // Visitor Location & Cookie Consent Log
    Route::post('/log-consent', [PublicApiController::class, 'logConsent'])->name('api.consent.log');
});

// Backward-compatible unversioned shortcuts
Route::get('/packages', [PublicApiController::class, 'getPackages']);
Route::get('/packages/{id}', [PublicApiController::class, 'getPackageDetail']);
Route::get('/categories', [PublicApiController::class, 'getCategories']);
Route::get('/portfolios', [PublicApiController::class, 'getPortfolios']);
Route::get('/settings', [PublicApiController::class, 'getSettings']);
Route::post('/inquiries', [PublicApiController::class, 'createInquiry']);
Route::post('/log-consent', [PublicApiController::class, 'logConsent']);
