import { createClient } from '@supabase/supabase-js';

// CONTACT FORM BACKEND (Ryan: "will probably use supabase for the be[nd]"):
// read from Vite env vars, not hardcoded -- `VITE_`-prefixed vars are
// inlined into the client bundle at build time (Vite's own convention, see
// https://vite.dev/guide/env-and-mode), so this is the anon/public key,
// never a service-role key (that one must never reach client code). Real
// values live in `.env.local` (gitignored via the existing `*.local` rule),
// not committed -- see `.env.example` for what to set and README.md/
// build-log.md for the table + RLS policy to create in the Supabase
// dashboard.
//
// Exported as `null` when unset (e.g. no `.env.local` yet, or a deploy
// target that hasn't configured these) rather than throwing -- lets
// ChromaContact.jsx fall back to its original `mailto:` behavior instead of
// breaking the form outright while Supabase isn't wired up yet.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
