The Netlify deploy errored, with the following guidance provided:

**Diagnosis**

- [line 63](#L63-L65) surfaces TS2367 errors from `src/components/AdminDashboard.tsx`: string comparisons use `"Pro"`/`"Business"`/`"Free"` while the `PlanTier` type is defined with lowercase literals (e.g. `"pro"`, `"business"`). Because those unions have no overlap, TypeScript terminates the build.
- [line 66](#L66-L67) shows TS2339 errors in `src/components/ComparePage.tsx`: the object that backs your comparison table is typed as `{ pro: number; business: number; unlimited: number; }`, but the code tries to read `proEvent` and `unlimited` from an object that only exposes `pro`/`business`.  
- [line 68](#L68) flags TS2365 in `src/components/LandingPage.tsx`: a `string | number` value is compared directly against a `number`, so TypeScript prevents the comparison.

**Solution**

1. In `src/components/AdminDashboard.tsx`, make the literals you compare against match the union’s casing. For example:
   ```ts
   // before
   if (selectedPlan === "Pro") { ... }

   // after
   if (selectedPlan === "pro") { ... }
   ```
   Apply the same change for `"Business"` → `"business"`, `"Free"` → `"free"`, etc., anywhere those TS2367 errors point (e.g. lines 584, 998, 1000).

2. In `src/components/ComparePage.tsx`, access the properties that actually exist on the typed object (or extend the type if `proEvent` is intentional). For instance, if you meant to use the existing fields:
   ```ts
   const eventsByPlan = { pro: 10, business: 20, unlimited: 999 };

   // before
   const proEvents = eventsByPlan.proEvent;

   // after
   const proEvents = eventsByPlan.pro;
   ```
   Likewise, ensure `eventsByPlan` (or the relevant object) really has an `unlimited` key; either rename the access to `enterprise`/`business` as appropriate or add the `unlimited` property to the object/type definition.

3. In `src/components/LandingPage.tsx`, normalise the value before numeric comparison:
   ```ts
   // before
   if (stat.value > 50) { ... }

   // after
   const numericValue = typeof stat.value === "string" ? Number(stat.value) : stat.value;
   if (numericValue > 50) { ... }
   ```
   Handle potential `NaN` cases if the string is not guaranteed to be numeric.

After these fixes, run `npm run build` locally to confirm the TypeScript compiler passes.

The relevant error logs are:

Line 53: [36m[1m​[22m[39m
Line 54: [36m[1m❯ Context[22m[39m
Line 55:   deploy-preview
Line 56: [96m[1m​[22m[39m
Line 57: [96m[1mbuild.command from netlify.toml                               [22m[39m
Line 58: [96m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 59: ​
Line 60: [36m$ npm run build[39m
Line 61: > votegenerator@1.0.0 build
Line 62: > tsc && vite build
Line 63: src/components/AdminDashboard.tsx(584,47): error TS2367: This comparison appears to be unintentional because the types '"pro" | 
Line 64: src/components/AdminDashboard.tsx(998,29): error TS2367: This comparison appears to be unintentional because the types '"pro" | 
Line 65: src/components/AdminDashboard.tsx(1000,29): error TS2367: This comparison appears to be unintentional because the types '"free"'
Line 66: src/components/ComparePage.tsx(184,27): error TS2339: Property 'proEvent' does not exist on type '{ pro: number; business: numbe
Line 67: src/components/ComparePage.tsx(203,27): error TS2339: Property 'unlimited' does not exist on type '{ pro: number; business: numb
Line 68: src/components/LandingPage.tsx(490,67): error TS2365: Operator '>' cannot be applied to types 'string | number' and 'number'.
Line 69: [91m[1m​[22m[39m
Line 70: [91m[1m"build.command" failed                                        [22m[39m
Line 71: [91m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 72: ​
Line 73:   [31m[1mError message[22m[39m
Line 74:   Command failed with exit code 2: npm run build
Line 75: ​
Line 76:   [31m[1mError location[22m[39m
Line 77:   In build.command from netlify.toml:
Line 78:   npm run build
Line 79: ​
Line 80:   [31m[1mResolved config[22m[39m
Line 81:   build:
Line 82:     command: npm run build
Line 83:     commandOrigin: config
Line 84:     environment:
Line 85:       - ADMIN_PASSWORD
Line 86:       - CLOUDINARY_API_KEY
Line 101:       - VG_SITE_ID
Line 102:       - VOTE_TOKEN_SECRET
Line 103:     publish: /opt/build/repo/dist
Line 104:     publishOrigin: config
Line 105:   functions:
Line 106:     "*":
Line 107:       node_bundler: esbuild
Line 108:   functionsDirectory: /opt/build/repo/netlify/functions
Line 109:   headers:
Line 110:     - for: /*.html
      values:
        Cache-Control: no-cache, no-store, must-revalidate
    - for: /assets/*
      values:
 
Line 111: Build failed due to a user error: Build script returned non-zero exit code: 2
Line 112: Failing build: Failed to build site
Line 113: Finished processing build request in 25.122s
Line 114: Failed during stage 'building site': Build script returned non-zero exit code: 2