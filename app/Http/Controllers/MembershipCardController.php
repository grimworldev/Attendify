<?php

namespace App\Http\Controllers;

use App\Http\Requests\MembershipCardRequest;
use App\Models\Member;
use App\Models\MembershipCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipCardController extends Controller
{
    /**
     * List every issued card — active and lost — across all members.
     */
    public function index(): Response
    {
        // $this->authorize('viewAny', MembershipCard::class);

        $cards = MembershipCard::query()
            ->with([
                'member:id,uuid,first_name,last_name',
                'issuedBy:id,first_name,last_name',
            ])
            ->latest('issued_at')
            ->get();

        return Inertia::render('membership-cards/index', [
            'cards' => $cards,
        ]);
    }

    /**
     * Form for assigning a new (or replacement) card to this member.
     */
    public function create(Member $member): Response
    {
        // $this->authorize('manageCard', $member);

        return Inertia::render('membership-cards/create', [
            'member' => $member->only(['uuid', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Assign a new RFID card to this member (first card, or a
     * replacement after a previous one was marked lost).
     */
    public function store(MembershipCardRequest $request, Member $member): RedirectResponse
    {
        // $this->authorize('manageCard', $member);

        MembershipCard::create([
            'member_id' => $member->id,
            'uid' => $request->validated('uid'),
            'status' => MembershipCard::STATUS_ACTIVE,
            'issued_at' => now(),
            'issued_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('members.show', $member)
            ->with('success', 'Card assigned successfully.');
    }

    /**
     * Not used — cards are shown inline on the member's profile and
     * the global membership-cards list, not their own detail page.
     */
    public function show(MembershipCard $card)
    {
        //
    }

    /**
     * Not used — status changes go through update() directly from
     * wherever the card is displayed, not a separate edit form.
     */
    public function edit(MembershipCard $card)
    {
        //
    }

    /**
     * Change a card's status — currently only used to mark a card lost,
     * but kept general (rather than a dedicated markLost route) so a
     * future "reissue"/reactivate action can reuse it.
     */
    public function update(Request $request, MembershipCard $card): RedirectResponse
    {
        // $this->authorize('manageCard', $card->member);

        $validated = $request->validate([
            'status' => ['required', 'integer', 'in:0,1'],
        ]);

        $card->update(['status' => $validated['status']]);

        $message = (int) $validated['status'] === MembershipCard::STATUS_LOST
            ? 'Card marked as lost.'
            : 'Card reactivated.';

        return redirect()
            ->route('members.show', $card->member)
            ->with('success', $message);
    }

    /**
     * Not used — cards are never deleted, only marked lost, to
     * preserve the audit trail of who had which card and when.
     */
    public function destroy(MembershipCard $card)
    {
        //
    }
}