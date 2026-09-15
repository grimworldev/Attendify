<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MembershipDetailController;
use App\Http\Controllers\MembershipTypeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::resource('users', UserController::class);
    Route::resource('members', MemberController::class);
    Route::resource('membership-types', MembershipTypeController::class);
    // Route::resource('membership-details', MembershipDetailController::class);
    Route::resource('members.membership-details', MembershipDetailController::class)
        ->shallow()
        ->parameters(['membership-details' => 'membershipDetail'])
        ->only(['store', 'update', 'destroy']);
});

require __DIR__ . '/settings.php';