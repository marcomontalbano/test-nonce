import {
  Application,
  Middleware,
  Router,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Snelm } from "https://deno.land/x/snelm@1.3.0/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import { crypto } from "https://deno.land/std@0.159.0/crypto/mod.ts";

import { getHTML } from "./App.tsx";

type State = {
  nonce?: string;
};

const csp: Middleware<State> = (ctx, next) => {
  if (ctx.request.url.pathname === "/nonce") {
    ctx.state.nonce = crypto.randomUUID();

    const snelm = new Snelm("oak", {
      csp: {
        directives: {
          scriptSrc: [`'nonce-${ctx.state.nonce}'`],
        },
      },
    });

    ctx.response = snelm.snelm(ctx.request, ctx.response);
  }

  next();
};

const router = new Router<State>();

router.get("/(|nonce)", (context) => {
  context.response.body = getHTML({ nonce: context.state.nonce });
});

const app = new Application<State>();

app.use(staticFiles("public"));
app.use(csp);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
