<?php

namespace App\Http\Controllers;

use App\Models\MembershipPayment;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', MembershipPayment::class);

        $transactions = MembershipPayment::query()
            ->with([
                'membershipDetail.member:id,uuid,first_name,last_name',
                'membershipDetail.membershipType:id,name',
                'processedBy:id,first_name,last_name',
            ])
            ->latest('paid_at')
            ->get();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            // Computed separately from the full (unpaginated) set so it always
            // reflects every transaction, not just what's currently displayed.
            'totalAmountPaid' => MembershipPayment::query()->sum('amount_paid'),
        ]);
    }
}