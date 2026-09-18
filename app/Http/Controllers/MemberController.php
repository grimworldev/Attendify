<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberRequest;
use App\Models\Member;
use App\Models\MembershipType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Member::class);

        $members = Member::query()
            ->with('currentMembership.membershipType')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('members/index', [
            'members' => $members,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Member::class);

        return Inertia::render('members/create');
    }

    public function store(MemberRequest $request): RedirectResponse
    {
        $this->authorize('create', Member::class);

        Member::create([
            ...$request->validated(),
            'registered_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('members.index')
            ->with('success', 'Member registered successfully.');
    }

    public function show(Member $member): Response
    {
        $this->authorize('view', $member);

        return Inertia::render('members/show', [
            'member' => $member->load([
                'currentMembership.membershipType',
                'currentMembership.payments',
                'registeredBy',
                'activeMembershipCard',
            ]),
            'hasActiveMembership' => $member->hasActiveMembership(),
            // Full transaction history — every signup + renewal, newest first.
            // Uses reorder() because the base membershipDetails() relation
            // defaults to oldest-first for other use cases.
            'membershipHistory' => $member->membershipDetails()
                ->reorder()
                ->latest('start_date')
                ->with(['membershipType:id,name', 'payments'])
                ->get(),
            // Options for the "Add / Renew Membership" dialog's plan select.
            'membershipTypes' => MembershipType::query()
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'duration_in_days']),
        ]);
    }

    public function edit(Member $member): Response
    {
        $this->authorize('update', $member);

        return Inertia::render('members/edit', [
            'member' => $member,
        ]);
    }

    public function update(MemberRequest $request, Member $member): RedirectResponse
    {
        $this->authorize('update', $member);

        $member->update($request->validated());

        return redirect()
            ->route('members.index')
            ->with('success', 'Member updated successfully.');
    }

    public function destroy(Member $member): RedirectResponse
    {
        $this->authorize('delete', $member);

        $member->delete();

        return redirect()
            ->route('members.index')
            ->with('success', 'Member deleted successfully.');
    }
}