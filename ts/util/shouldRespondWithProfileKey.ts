// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { ConversationModel } from '../models/conversations';

export async function shouldRespondWithProfileKey(
  sender: ConversationModel
): Promise<boolean> {
  if (sender.isMe() || !sender.getAccepted() || sender.isBlocked()) {
    return false;
  }

  // We do message check in an attempt to avoid a database lookup. If someone was EVER in
  //   a shared group with us, we should've shared our profile key with them in the past,
  //   so we should respond with a profile key now.
  if (sender.get('sharedGroupNames')?.length) {
    return true;
  }

  await sender.updateSharedGroups();
  return Boolean(sender.get('sharedGroupNames')?.length);
}
