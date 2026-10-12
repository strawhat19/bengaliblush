'use client';

import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import '../owner-records-table/owner-records-table.scss';
import type { LucideIcon } from 'lucide-react';
import StatusCell from '../status-cell/status-cell';
import { useAuth } from '@/shared/authContext/useAuth';
import { useAdminFeatures } from './use-admin-features';
import { siteRoutes } from '@/shared/navigation/routes';
import type { FeatureKey } from '@/shared/featureFlags/types';
import AccountAccess from '../account-access/account-access';
import FeatureEditor from './feature-editor/feature-editor';
import AdminSkeleton from '../admin-skeleton/admin-skeleton';
import { featureDefinitions } from '@/shared/featureFlags/values';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';
import AdminEditorModal from '../admin-editor-modal/admin-editor-modal';
import AccountNavigation from '../account-navigation/account-navigation';
import { getAdminParentMenuLabel } from '@/shared/navigation/account-navigation';
import { X, Bell, Flag, Check, Settings, Megaphone, RotateCcw, CreditCard, Paintbrush, MessageCircle, CircleCheck } from 'lucide-react';
import './admin-features.scss';

const featureIcons: Record<FeatureKey, LucideIcon> = {
  marquee: Megaphone,
  notifications: Bell,
  themeToggle: Paintbrush,
  contact: MessageCircle,
};

const AdminFeaturesContent = () => {
  const { edit, busy, error, retry, tiers, values, loading, canEdit, feedback, editorKey, savingKey, tiersError, changePlan, changeValue, closeEditor, saveSettings, tiersLoading } = useAdminFeatures();
  const pageId = `bb-admin-features`;
  const editor = featureDefinitions.find(({ key }) => key === editorKey);
  const editorRecord = editorKey ? values?.[editorKey] : null;
  const controlsDisabled = !canEdit || busy || Boolean(editorKey);
  return (
    <section id={pageId} className={`bb-section bb-owner-dashboard bb-admin-features`} aria-labelledby={`${pageId}-title`}>
      <div id={`${pageId}-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`${pageId}-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || busy}>
          <div id={`${pageId}-heading`} className={`bb-owner-dashboard-heading is-record-page`}>
            <div id={`${pageId}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}><span id={`${pageId}-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`${pageId}-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> {getAdminParentMenuLabel(siteRoutes.adminFeatures)}</span></span>
              <h1 id={`${pageId}-title`} className={`bb-owner-dashboard-title has-table-icon`}><Flag size={28} aria-hidden={`true`} id={`${pageId}-title-icon`} className={`bb-owner-dashboard-title-icon`} />{siteRoutes.adminFeatures.label}</h1>
            </div>
          </div>
          {error && <div id={`${pageId}-read-error`} className={`bb-owner-dashboard-error bb-admin-features-read-error`}><p id={`${pageId}-read-error-message`} className={`bb-admin-features-error-message`} role={`alert`}>{error}</p><button type={`button`} disabled={busy || loading} id={`${pageId}-retry`} className={`bb-admin-feature-action bb-admin-features-retry`} onClick={() => { void retry(); }}><RotateCcw size={14} aria-hidden={`true`} />Retry</button></div>}
          {loading && !values ? <AdminSkeleton rows={4} columns={6} id={`${pageId}-loading`} label={`Loading Features`} /> : (
            <section id={`${pageId}-records`} className={`bb-owner-records is-standalone`} aria-labelledby={`${pageId}-title`}>
              <div id={`${pageId}-table-wrap`} className={`bb-owner-table-wrap`}><table id={`${pageId}-table`} className={`bb-owner-table bb-admin-features-table`}>
                <caption id={`${pageId}-table-caption`} className={`bb-owner-table-caption`}>Studio Features</caption>
                <thead id={`${pageId}-table-head`} className={`bb-owner-table-head`}><tr id={`${pageId}-column-row`} className={`bb-owner-table-column-row`}>{[`No.`, `Feature`, `Description`, `Value`, `Plans`, `Actions`].map((label, index) => <th key={label} scope={`col`} id={`${pageId}-column-${index}`} className={`bb-owner-table-column`}>{label}</th>)}</tr></thead>
                <tbody id={`${pageId}-table-body`} className={`bb-owner-table-body`}>{featureDefinitions.map(({ key, label, number }) => {
                  const rowId = `${pageId}-${key}`;
                  const Icon = featureIcons[key];
                  const record = values?.[key];
                  const minimumPlan = record?.audience.plans?.[0];
                  const knownMinimum = tiers.some((tier) => tier.slug === minimumPlan);
                  const rowFeedback = feedback?.key === key ? feedback : null;
                  return <tr key={key} id={rowId} className={`bb-admin-feature-row`} aria-busy={savingKey === key}>
                    <td id={`${rowId}-number`} className={`bb-admin-feature-number`}><span id={`${rowId}-number-badge`} className={`bb-table-number-badge`}>{number}</span></td>
                    <td id={`${rowId}-identity-cell`} className={`bb-admin-feature-identity-cell`}><div id={`${rowId}-identity`} className={`bb-admin-feature-identity`}><span id={`${rowId}-thumbnail`} className={`bb-admin-feature-thumbnail`} aria-hidden={`true`}><Icon size={18} strokeWidth={1.6} id={`${rowId}-icon`} className={`bb-admin-feature-icon`} /></span><strong id={`${rowId}-name`} className={`bb-admin-feature-name`}>{label}</strong></div></td>
                    <td id={`${rowId}-description`} className={`bb-admin-feature-description`}>{record?.description || (record ? `—` : `Unavailable`)}</td>
                    <td id={`${rowId}-value`} className={`bb-admin-feature-value`}><StatusCell id={`${rowId}-value`} status={record ? record.enabled ? `active` : `inactive` : `unavailable`} /></td>
                    <td id={`${rowId}-plans-cell`} className={`bb-admin-feature-plans-cell`}>
                      <span id={`${rowId}-plan-label`} className={`bb-admin-feature-plan-label`}>{!record ? `Unavailable` : minimumPlan ? knownMinimum ? `${minimumPlan} And Above` : `Unavailable Minimum: ${minimumPlan}` : `Free And Above`}</span>
                      {record && tiers.length > 0 && <div id={`${rowId}-plans`} role={`group`} aria-label={`${label} Minimum Plan`} className={`bb-admin-feature-plans`}>{tiers.map(({ id, slug }) => <button key={id} type={`button`} disabled={controlsDisabled || tiersLoading || Boolean(tiersError)} id={`${rowId}-plan-${id}`} aria-pressed={minimumPlan === slug} className={`bb-admin-feature-plan${minimumPlan === slug ? ` is-active` : ``}`} onClick={() => { void changePlan(key, minimumPlan === slug ? null : slug); }}><CreditCard size={12} aria-hidden={`true`} id={`${rowId}-plan-${id}-icon`} className={`bb-admin-feature-plan-icon`} />{slug}</button>)}</div>}
                      {record && minimumPlan && !knownMinimum && <button type={`button`} disabled={controlsDisabled} id={`${rowId}-clear-plan`} className={`bb-admin-feature-clear-plan`} onClick={() => { void changePlan(key, null); }}><X size={12} aria-hidden={`true`} />Clear Minimum Plan</button>}
                    </td>
                    <td id={`${rowId}-actions-cell`} className={`bb-admin-feature-actions-cell`}>
                      <div id={`${rowId}-actions`} className={`actionsCell bb-admin-feature-actions`}>
                        <div id={`${rowId}-value-controls`} role={`group`} aria-label={`${label} Global Value`} className={`bb-admin-feature-segments`}>{[{ enabled: false, label: `Disable`, Icon: X }, { enabled: true, label: `Enable`, Icon: Check }].map(({ enabled, label: actionLabel, Icon: ActionIcon }) => <button key={actionLabel} type={`button`} disabled={controlsDisabled} id={`${rowId}-${enabled ? `enable` : `disable`}`} aria-pressed={record?.enabled === enabled} className={`bb-admin-feature-segment${record?.enabled === enabled ? ` is-active` : ``}`} onClick={() => { void changeValue(key, enabled); }}><ActionIcon size={12} aria-hidden={`true`} />{actionLabel}</button>)}</div>
                        <button type={`button`} disabled={controlsDisabled} id={`${rowId}-settings`} className={`bb-admin-feature-action`} title={`${label} Settings`} aria-label={`${label} Settings`} aria-haspopup={`dialog`} onClick={() => edit(key)}><Settings size={15} aria-hidden={`true`} /></button>
                      </div>
                      {(savingKey === key || rowFeedback) && <p id={`${rowId}-feedback`} className={`bb-admin-feature-feedback${rowFeedback?.failed ? ` is-error` : ``}`} role={rowFeedback?.failed ? `alert` : `status`}>{savingKey === key ? `Saving` : <>{!rowFeedback?.failed && <CircleCheck size={12} aria-hidden={`true`} />}{rowFeedback?.message}</>}</p>}
                    </td>
                  </tr>;
                })}</tbody>
              </table></div>
              {(tiersLoading || tiersError || !tiers.length) && <p id={`${pageId}-plan-availability`} className={`bb-admin-features-plan-availability`} role={tiersError ? `status` : undefined}>{tiersLoading ? `Loading Plan Tiers` : tiersError || `No Paid Plan Tiers Are Configured`}</p>}
            </section>
          )}
          {editor && editorKey && editorRecord && <AdminEditorModal
            busy={busy}
            key={editorKey}
            onClose={closeEditor}
            id={`${pageId}-${editorKey}-modal`}
            labelledBy={`${pageId}-${editorKey}-editor-title`}
            error={feedback?.key === editorKey && feedback.failed ? feedback.message : undefined}
          >
            {(dismiss) => <FeatureEditor busy={busy} canSave={canEdit} label={editor.label} record={editorRecord} onClose={dismiss} Icon={featureIcons[editorKey]} id={`${pageId}-${editorKey}-editor`} onSave={(description, roles) => saveSettings(editorKey, description, roles)} />}
          </AdminEditorModal>}
        </div>
      </div>
    </section>
  );
};

const AdminFeatures = () => {
  const { user } = useAuth();
  const { retry, accessError, accessLoading, canManageFeatures } = useFeatureFlags();
  return <AccountAccess ownerOnly>{user && (canManageFeatures ? <AdminFeaturesContent key={user.id} /> : (
    <section id={`bb-features-access`} className={`bb-section bb-account-access`} aria-busy={accessLoading}>
      <div id={`bb-features-access-content`} className={`bb-container bb-account-access-content`}>
        <Flag size={28} aria-hidden={`true`} />
        <h1 id={`bb-features-access-title`} className={`bb-account-access-heading`}>{accessLoading ? `Features` : `Owner Access Required`}</h1>
        {accessLoading ? <AdminSkeleton rows={2} variant={`inline`} id={`bb-features-access-loading`} label={`Loading Owner Access`} /> : <p id={`bb-features-access-error`} className={`bb-account-access-error`} role={`alert`}>{accessError ?? `Active Owner Access Could Not Be Confirmed`}</p>}
        {!accessLoading && <button type={`button`} onClick={retry} id={`bb-features-access-retry`} className={`bb-button`}><RotateCcw size={14} aria-hidden={`true`} />Retry</button>}
      </div>
    </section>
  ))}</AccountAccess>;
};

export default AdminFeatures;
