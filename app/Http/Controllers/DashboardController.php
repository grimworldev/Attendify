<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\MembershipDetail;
use App\Models\MembershipPayment;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Date::today();

        $activeMemberships = Member::query()
            ->whereHas('currentMembership', function ($query) use ($today) {
                $query->where('status', MembershipDetail::STATUS_ACTIVE)
                    ->whereDate('end_date', '>=', $today);
            })
            ->count();

        $expiringSoon = Member::query()
            ->whereHas('currentMembership', function ($query) use ($today) {
                $query->where('status', MembershipDetail::STATUS_ACTIVE)
                    ->whereBetween('end_date', [$today, $today->copy()->addDays(7)]);
            })
            ->count();

        $incomeThisMonth = MembershipPayment::query()
            ->whereYear('paid_at', $today->year)
            ->whereMonth('paid_at', $today->month)
            ->sum('amount_paid');

        $recentTransactions = MembershipPayment::query()
            ->with('membershipDetail.member:id,uuid,first_name,last_name')
            ->latest('paid_at')
            ->limit(5)
            ->get(['id', 'transaction_no', 'amount_paid', 'paid_at', 'membership_detail_id']);

        return Inertia::render('dashboard/index', [
            'stats' => [
                'totalMembers' => Member::count(),
                'activeMemberships' => $activeMemberships,
                'expiringSoon' => $expiringSoon,
                'incomeThisMonth' => $incomeThisMonth,
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }
}