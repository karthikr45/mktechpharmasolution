"use client";

import { useState } from "react";

export interface ESignature {
  name: string;
  userId: string;
  reason: string;
  signedAt: string;
}

export default function ESignModal({
  title,
  scenarioName,
  onSign,
  onCancel,
}: {
  title: string;
  scenarioName: string;
  onSign: (sig: ESignature) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("Training");
  const [pin, setPin] = useState("");
  const [ack, setAck] = useState(false);

  const ready =
    name.trim().length > 1 &&
    userId.trim().length > 1 &&
    pin.length >= 4 &&
    ack;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="card w-full max-w-md border-pharma-accent/30">
        <div className="flex items-center gap-2">
          <span className="badge bg-pharma-accent/20 text-pharma-accent border border-pharma-accent/30">
            21 CFR Part 11
          </span>
          <span className="text-xs text-slate-500">Electronic signature</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          You are signing to begin the{" "}
          <span className="text-pharma-accent">{scenarioName}</span> training
          scenario. Your signature and all actions will be recorded in the LRS.
        </p>

        <div className="mt-4 space-y-3">
          <Field
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="e.g. Ramesh Kumar"
          />
          <Field
            label="Employee ID"
            value={userId}
            onChange={setUserId}
            placeholder="e.g. emp-4021"
            mono
          />
          <div>
            <label className="text-[11px] uppercase tracking-wide text-slate-400">
              Reason for signing
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-md border border-pharma-border bg-pharma-bg px-3 py-2 text-sm text-white focus:border-pharma-accent focus:outline-none"
            >
              <option>Training</option>
              <option>Annual re-qualification</option>
              <option>New SOP familiarisation</option>
              <option>Corrective action</option>
            </select>
          </div>
          <Field
            label="PIN (≥ 4 digits)"
            value={pin}
            onChange={setPin}
            placeholder="••••"
            type="password"
            mono
          />
        </div>

        <label className="mt-4 flex items-start gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          <span>
            I confirm that this electronic signature is the legally binding
            equivalent of my handwritten signature (per 21 CFR 11.100).
          </span>
        </label>

        <div className="mt-5 flex gap-2">
          {onCancel && (
            <button className="btn-ghost flex-1" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button
            className="btn-primary flex-1"
            disabled={!ready}
            onClick={() =>
              onSign({
                name: name.trim(),
                userId: userId.trim(),
                reason,
                signedAt: new Date().toISOString(),
              })
            }
          >
            Sign & begin
          </button>
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          MVP note: PIN is not validated against an identity provider. Pilot
          deployment replaces this with OIDC to plant SSO.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-md border border-pharma-border bg-pharma-bg px-3 py-2 text-sm text-white focus:border-pharma-accent focus:outline-none ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}
