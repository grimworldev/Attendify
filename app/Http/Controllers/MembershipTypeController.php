<?php

namespace App\Http\Controllers;

use App\Http\Requests\MembershipTypeRequest;
use App\Models\MembershipType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MembershipTypeController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', MembershipType::class);

        $membershipTypes = MembershipType::query()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('membership-types/index', [
            'membershipTypes' => $membershipTypes,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MembershipType::class);

        return Inertia::render('membership-types/create');
    }

    public function store(MembershipTypeRequest $request): RedirectResponse
    {
        $this->authorize('create', MembershipType::class);

        MembershipType::create($request->validated());

        return redirect()
            ->route('membership-types.index')
            ->with('success', 'Membership type created successfully.');
    }

    public function show(MembershipType $membershipType): Response
    {
        $this->authorize('view', $membershipType);

        return Inertia::render('membership-types/show', [
            'membershipType' => $membershipType,
        ]);
    }

    public function edit(MembershipType $membershipType): Response
    {
        $this->authorize('update', $membershipType);

        return Inertia::render('membership-types/edit', [
            'membershipType' => $membershipType,
        ]);
    }

    public function update(MembershipTypeRequest $request, MembershipType $membershipType): RedirectResponse
    {
        $this->authorize('update', $membershipType);

        $membershipType->update($request->validated());

        return redirect()
            ->route('membership-types.index')
            ->with('success', 'Membership type updated successfully.');
    }

    public function destroy(MembershipType $membershipType): RedirectResponse
    {
        $this->authorize('delete', $membershipType);

        $membershipType->delete();

        return redirect()
            ->route('membership-types.index')
            ->with('success', 'Membership type deleted successfully.');
    }
}