"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { TireCatalogReadModel } from "@/lib/catalog/tireReadModel";
import { recommendTires } from "@/lib/selection/engine";
import type { SelectionState, SelectionStep } from "@/lib/selection/types";
import { getFirstMissingStep, parseSelectionParams, serializeSelectionParams } from "@/lib/selection/urlState";

import { FitmentStep } from "./FitmentStep";
import { OperatingConditionsStep } from "./OperatingConditionsStep";
import styles from "./Selection.module.css";
import { SelectionProgress } from "./SelectionProgress";
import { SelectionResult } from "./SelectionResult";
import { VehicleTypeStep } from "./VehicleTypeStep";

const STEP_ORDER: SelectionStep[] = ["vehicle", "conditions", "fitment", "result"];

function resolveStep(params: URLSearchParams, state: SelectionState): SelectionStep {
  const missing = getFirstMissingStep(state);
  const requested = params.get("step") as SelectionStep | null;
  if (!requested || !STEP_ORDER.includes(requested)) return missing;
  if (STEP_ORDER.indexOf(requested) > STEP_ORDER.indexOf(missing)) return missing;
  return requested;
}

function selectionHref(state: SelectionState, step: SelectionStep): string {
  const params = serializeSelectionParams(state);
  params.set("step", step);
  return `/selection?${params.toString()}`;
}

export function SelectionWizard({
  catalog,
  initialState,
}: {
  catalog: TireCatalogReadModel;
  initialState: SelectionState;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsed = useMemo(() => parseSelectionParams(searchParams), [searchParams]);
  const activeStep = resolveStep(new URLSearchParams(searchParams.toString()), parsed);
  const [draft, setDraft] = useState<SelectionState>(initialState);
  const questionRef = useRef<HTMLLegendElement>(null);

  useEffect(() => {
    setDraft(parsed);
  }, [searchParams, parsed]);

  useEffect(() => {
    if (activeStep !== "vehicle") questionRef.current?.focus();
  }, [activeStep]);

  const syncDraft = (nextState: SelectionState, step: SelectionStep = activeStep) => {
    setDraft(nextState);
    router.replace(selectionHref(nextState, step), { scroll: false });
  };

  const advance = (nextState: SelectionState, nextStep: SelectionStep) => {
    setDraft(nextState);
    router.push(selectionHref(nextState, nextStep), { scroll: false });
  };

  const canContinue =
    (activeStep === "vehicle" && Boolean(draft.vehicle)) ||
    (activeStep === "conditions" && draft.conditions.length > 0) ||
    (activeStep === "fitment" &&
      Boolean(draft.axle) &&
      typeof draft.sizeKnown === "boolean" &&
      (!draft.sizeKnown || Boolean(draft.size?.trim())));

  const result = activeStep === "result" ? recommendTires(catalog, draft) : null;

  if (activeStep === "result" && result) {
    return (
      <div className={styles.wizard}>
        <SelectionProgress step={activeStep} />
        <SelectionResult result={result} catalog={catalog} state={draft} />
        <button className={styles.backButton} type="button" onClick={() => router.back()}>← Назад к параметрам</button>
      </div>
    );
  }

  const nextStep: SelectionStep = activeStep === "vehicle" ? "conditions" : activeStep === "conditions" ? "fitment" : "result";

  return (
    <div className={styles.wizard}>
      <SelectionProgress step={activeStep} />
      {activeStep === "vehicle" && (
        <VehicleTypeStep
          value={draft.vehicle}
          onChange={(vehicle) => syncDraft({ conditions: [], vehicle })}
        />
      )}
      {activeStep === "conditions" && (
        <OperatingConditionsStep
          ref={questionRef}
          values={draft.conditions}
          onChange={(conditions) => syncDraft({ ...draft, conditions })}
        />
      )}
      {activeStep === "fitment" && (
        <FitmentStep ref={questionRef} state={draft} onChange={(next) => syncDraft(next)} />
      )}
      <div className={styles.wizardActions}>
        {activeStep !== "vehicle" && <button className={styles.backButton} type="button" onClick={() => router.back()}>Назад</button>}
        <button className="btn-accent" type="button" disabled={!canContinue} onClick={() => advance(draft, nextStep)}>Продолжить</button>
      </div>
    </div>
  );
}
