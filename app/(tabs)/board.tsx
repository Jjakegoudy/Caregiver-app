import React from 'react';
import { EmptyState, Header, Screen } from '../../components/ui';

/**
 * Tab 5 — The Board. Classifieds, stories, and structured "Add Your
 * Perspective" replies — no open comment threads, every reply passes an
 * AI civility + substance check. Free tier.
 *
 * Community mechanics arrive in Phase 5 (Build Order Steps 14–16).
 */
export default function BoardScreen() {
  return (
    <Screen>
      <Header title="Board" />
      <EmptyState
        icon="people-outline"
        title="Stories, tips, and gear from parents who get it."
        body="No open comment threads — every reply is structured and checked for civility and substance before it posts. Arrives in Phase 5."
      />
    </Screen>
  );
}
