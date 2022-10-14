import {
  FC,
  Fragment,
  h,
  renderSSR,
} from "https://deno.land/x/nano_jsx@v0.0.34/mod.ts";

import { highlightText } from "https://deno.land/x/speed_highlight_js@1.1.7/dist/index.js";
import "https://deno.land/x/speed_highlight_js@1.1.7/dist/languages/js.js";

type Props = {
  nonce?: string;
};

const jsCode = await highlightText(
  `var scriptElement = document.createElement('script');
scriptElement.innerHTML = 'alert("Hello World!")';
document.body.append(scriptElement);`,
  "js",
  false,
);

const App: FC<Props> = ({ nonce }) => {
  return (
    <html>
      <head>
        <title>nonce</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@speed-highlight/core@1.1.7/dist/themes/default.css"
        />

        <script nonce={nonce}>
          console.log('Hi from "nonce" script!');
        </script>
        <script>console.log('Hi from "non-nonce" script!');</script>
      </head>
      <body>
        <div class="m-4">
          <div class="container content">
            <h1 class="title">nonce</h1>

            <p>Open the developer tool on console panel and reload the page.</p>

            <p>
              Copy & paste the following script and check the differences
              between enabling/disabling the{" "}
              <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce">
                nonce
              </ExternalLink>.
            </p>

            <div
              style={{
                "font": "16px monospace",
                "line-height": "1.5",
                "overflow": "auto",
              }}
              class="shj-lang-js mb-5"
              dangerouslySetInnerHTML={{ __html: jsCode }}
            />

            <CSPMessage nonce={nonce} />

            Hosted by{" "}
            <ExternalLink href="https://deno.com/deploy">
              Deno Deploy
            </ExternalLink>. Source code on{" "}
            <ExternalLink href="https://github.com/marcomontalbano/test-nonce">
              GitHub
            </ExternalLink>.
          </div>
        </div>
      </body>
    </html>
  );
};

export function getHTML({ nonce }: Props): string {
  return renderSSR(<App nonce={nonce} />);
}

const ExternalLink: FC<{ href: string; children: Element | string }> = (
  { href, children },
) => {
  return (
    <span class="icon-text">
      <a
        href={href}
        target="_blank"
      >
        {children}
        <span class="icon">
          <svg
            width="8"
            height="8"
            stroke="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
          </svg>
        </span>
      </a>
    </span>
  );
};

const CSPMessage: FC<Props> = ({ nonce }) => {
  return nonce
    ? (
      <>
        <article class="message is-success">
          <div class="message-body">
            Content Security Policy is set.<br />
            <a href="/">disable</a>
          </div>
        </article>
      </>
    )
    : (
      <>
        <article class="message is-warning">
          <div class="message-body">
            Content Security Policy is not set.<br />
            <a href="/nonce">enable</a>
          </div>
        </article>
      </>
    );
};
