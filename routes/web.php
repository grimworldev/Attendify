<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MembershipCardController;
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

    // Global list + status updates (mark lost / reissue) live here.
    Route::resource('membership-cards', MembershipCardController::class)
        ->parameters(['membership-cards' => 'card'])
        ->only(['index', 'update']);

    // Assigning a card only makes sense in the context of a specific member.
    Route::resource('members.membership-cards', MembershipCardController::class)
        ->only(['create', 'store']);
});

require __DIR__ . '/settings.php';