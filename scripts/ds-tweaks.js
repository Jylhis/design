// ds-tweaks.js — page-level mode tweaks for every specimen page, built on the
// official Tweaks panel (scripts/tweaks-panel.js). Writes the selection onto
// <html> as data-mode / data-density; no custom page chrome.
// JSX inside — loaded via <script type="text/babel"> after React, ReactDOM and
// tweaks-panel.js.

const DS_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "density": "default",
  "grayscale": false
}/*EDITMODE-END*/;

function DsThemeTweaks() {
  const [t, setTweak] = useTweaks(DS_TWEAK_DEFAULTS);
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-mode', t.mode);
    r.setAttribute('data-density', t.density);
    r.style.filter = t.grayscale ? 'grayscale(1)' : '';
  }, [t.mode, t.density, t.grayscale]);
  return (
    <TweaksPanel>
      <TweakSection label="Mode" />
      <TweakRadio label="Mode" value={t.mode} options={['light', 'dark']}
                  onChange={(v) => setTweak('mode', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density}
                  options={['comfortable', 'default', 'compact']}
                  onChange={(v) => setTweak('density', v)} />
      <TweakToggle label="Grayscale check" value={t.grayscale}
                   onChange={(v) => setTweak('grayscale', v)} />
    </TweaksPanel>
  );
}

// Its own root, so it composes with whatever the page already renders.
(function () {
  function mount() {
    const host = document.createElement('div');
    document.body.appendChild(host);
    ReactDOM.createRoot(host).render(React.createElement(DsThemeTweaks));
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
