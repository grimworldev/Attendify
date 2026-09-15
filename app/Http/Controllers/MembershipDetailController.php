<?php

namespace App\Http\Controllers;

use App\Http\Requests\MembershipDetailRequest;
use App\Models\Member;
use App\Models\MembershipDetail;
use App\Models\MembershipPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MembershipDetailController extends Controller
{
    /**
     * Not used — membership history is displayed as part of the member's
     * show page rather than a dedicated index.
     */
    public function index()
    {
        //
    }

    /**
     * Not used — creation happens via a Dialog on the member's show page,
     * submitting straight to store(), rather than a dedicated create page.
     */
    public function create()
    {
        //
    }

    /**
     * Create a membership transaction (signup or renewal) AND its first
     * payment in one atomic operation — if either insert fails, neither
     * is committed. Nested under the member (members/{member}/membership-details)
     * since a membership can't exist without one.
     */
    public function store(MembershipDetailRequest $request, Member $member)
    {
        $this->authorize('manageMembership', $member);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $member, $request) {
            $membershipDetail = MembershipDetail::create([
                'member_id' => $member->id,
                'membership_type_id' => $validated['membership_type_id'],
                'type' => $validated['type'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => MembershipDetail::STATUS_ACTIVE,
                'processed_by' => $request->user()->id,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Compute change server-side — never trust a client-sent value here.
            $change = null;
            if ((int) $validated['payment_method'] === MembershipPayment::METHOD_CASH) {
                $change = max(0, $validated['amount_tendered'] - $validated['amount_paid']);
            }

            MembershipPayment::create([
                'membership_detail_id' => $membershipDetail->id,
                'payment_method' => $validated['payment_method'],
                'amount_paid' => $validated['amount_paid'],
                'amount_tendered' => $validated['amount_tendered'] ?? null,
                'change' => $change,
                'reference_no' => $validated['reference_no'] ?? null,
                'processed_by' => $request->user()->id,
                'paid_at' => now(),
                'notes' => $validated['payment_notes'] ?? null,
            ]);
        });

        return redirect()
            ->route('members.show', $member)
            ->with('success', 'Membership recorded successfully.');
    }

    /**
     * Not used directly — membership details are shown inline on the
     * member's show page rather than having their own view route.
     */
    public function show(MembershipDetail $membershipDetail)
    {
        //
    }

    /**
     * Not used — corrections to a membership record (wrong date, wrong
     * plan) go through update() directly from wherever the history is
     * displayed, not a separate edit page.
     */
    public function edit(MembershipDetail $membershipDetail)
    {
        //
    }

    /**
     * Correct a membership record after the fact (e.g. wrong dates, wrong
     * plan selected, cancelling/suspending). This does NOT touch payments —
     * if the amount paid was wrong, that's fixed via a MembershipPayment
     * record instead, to preserve the payment audit trail.
     */
    public function update(MembershipDetailRequest $request, MembershipDetail $membershipDetail): RedirectResponse
    {
        $this->authorize('update', $membershipDetail);

        $membershipDetail->update($request->validated());

        return redirect()
            ->route('members.show', $membershipDetail->member)
            ->with('success', 'Membership record updated.');
    }

    /**
     * Removes a membership transaction. cascadeOnDelete on
     * membership_payments.membership_detail_id means its payment rows
     * are removed automatically — use sparingly, this destroys the
     * audit trail rather than just marking it cancelled.
     */
    public function destroy(MembershipDetail $membershipDetail): RedirectResponse
    {
        $this->authorize('delete', $membershipDetail);

        $member = $membershipDetail->member;

        $membershipDetail->delete();

        return redirect()
            ->route('members.show', $member)
            ->with('success', 'Membership record removed.');
    }
}