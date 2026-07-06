// Scoped styles for the admin shell. Kept in one place so the layout stays
// readable. Uses the site's navy/gold tokens but a distinctly cooler, app-like
// canvas so the admin is never mistaken for the live public site.
export default function AdminChromeStyles() {
  return (
    <style>{`
      .admin-shell {
        display: grid;
        grid-template-columns: 244px 1fr;
        min-height: 100vh;
        background: var(--color-surface-alt);
      }

      /* ── Sidebar ── */
      .asb {
        grid-row: 1;
        background: linear-gradient(185deg, var(--color-navy-deeper), var(--color-navy-dark));
        border-right: 1px solid rgba(0,0,0,.2);
        padding: 22px 16px;
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .asb-head {
        display: flex; flex-direction: column; gap: 2px;
        padding: 4px 10px 18px;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }
      .asb-mark {
        font-family: var(--font-serif); font-size: 19px; font-weight: 600; color: #fff;
      }
      .asb-mark-sub {
        font-family: var(--font-sans); font-size: 11px; font-weight: 600;
        letter-spacing: .16em; text-transform: uppercase; color: #F7C04A;
      }
      .asb-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
      .asb-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 12px; border-radius: 7px;
        color: #cfd6e8; font-family: var(--font-sans); font-size: 15px; font-weight: 500;
        text-decoration: none; transition: background .12s, color .12s;
      }
      .asb-item:hover { background: rgba(255,255,255,.07); color: #fff; text-decoration: none; }
      .asb-item.is-active {
        background: rgba(242,169,0,.16); color: #fff;
        box-shadow: inset 3px 0 0 var(--color-gold);
      }
      .asb-icon { display: inline-flex; color: #F7C04A; }

      /* ── Main column ── */
      .admin-main { display: flex; flex-direction: column; min-width: 0; }

      /* ── Top bar ── */
      .atb {
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; padding: 0 26px; height: 62px;
        background: #fff; border-bottom: 1px solid var(--color-border);
        position: sticky; top: 0; z-index: 5;
      }
      .atb-brand {
        font-family: var(--font-serif); font-size: 18px; font-weight: 600;
        color: var(--color-navy); text-decoration: none;
      }
      .atb-brand:hover { text-decoration: none; opacity: .85; }
      .atb-brand-dot { color: var(--color-border-strong); margin: 0 2px; }
      .atb-brand-admin { color: var(--color-gold-dark); }
      .atb-actions { display: flex; align-items: center; gap: 10px; }
      .atb-btn {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 8px 14px; border-radius: 7px; cursor: pointer;
        font-family: var(--font-sans); font-size: 14px; font-weight: 600;
        border: 1px solid transparent; text-decoration: none; transition: background .12s, border-color .12s;
      }
      .atb-btn-ghost {
        color: var(--color-navy); background: #fff; border-color: var(--color-border-strong);
      }
      .atb-btn-ghost:hover { background: var(--color-surface-alt); text-decoration: none; }
      .atb-btn-logout { color: #fff; background: var(--color-navy); }
      .atb-btn-logout:hover:not(:disabled) { background: var(--color-navy-dark); }
      .atb-btn-logout:disabled { opacity: .6; cursor: not-allowed; }

      /* ── Persistent "ADMIN MODE" banner (reuses the golf-banner slot/style) ── */
      .admin-banner {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        min-height: 40px; padding: 8px 20px;
        background: var(--color-gold);
        color: var(--color-navy-dark);
        font-family: var(--font-sans); font-size: 13.5px; font-weight: 700;
        letter-spacing: .06em; text-transform: uppercase; text-align: center;
      }
      .admin-banner-dot {
        width: 9px; height: 9px; border-radius: 50%;
        background: var(--color-kofc-red);
        box-shadow: 0 0 0 3px rgba(200,16,46,.25);
      }

      /* ── Content canvas ── */
      .admin-content { padding: 34px 30px 60px; flex: 1; }

      @media (max-width: 780px) {
        .admin-shell { grid-template-columns: 1fr; }
        .asb {
          position: static; height: auto; flex-direction: row; align-items: center;
          gap: 8px; overflow-x: auto; padding: 12px 14px;
        }
        .asb-head { display: none; }
        .asb-list { flex-direction: row; gap: 4px; }
        .asb-item { white-space: nowrap; padding: 8px 12px; }
        .asb-item.is-active { box-shadow: inset 0 -3px 0 var(--color-gold); }
        .admin-content { padding: 22px 18px 48px; }
        .atb { padding: 0 16px; }
      }
    `}</style>
  )
}
