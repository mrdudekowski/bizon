"use client";

import {
  Button,
  ConfirmationModal,
  toast,
  useConfig,
  useModal,
  useRouteCache,
  useSelection,
} from "@payloadcms/ui";
import { requests } from "@payloadcms/ui/shared";
import { useRouter } from "next/navigation";
import type { BeforeListTableClientProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { useCallback } from "react";

/**
 * Bulk-publish for collections that use the custom `status` field
 * (Payload's built-in PublishMany only appears when versions.drafts is on).
 */
export function PublishSelectedButton({
  collectionSlug,
}: BeforeListTableClientProps) {
  const { count, getQueryParams, toggleAll } = useSelection();
  const { openModal } = useModal();
  const { clearRouteCache } = useRouteCache();
  const router = useRouter();
  const {
    config: {
      routes: { api },
    },
  } = useConfig();

  const modalSlug = `publish-selected-${collectionSlug}`;

  const handlePublish = useCallback(async () => {
    const query = getQueryParams({
      status: { not_equals: "published" },
    });
    const url = formatAdminURL({
      apiRoute: api,
      path: `/${collectionSlug}${query}`,
    });

    try {
      const res = await requests.patch(url, {
        body: JSON.stringify({ status: "published" }),
        headers: { "Content-Type": "application/json" },
      });
      const json = (await res.json().catch(() => null)) as {
        docs?: unknown[];
        errors?: { message?: string }[];
        message?: string;
      } | null;

      const updated = json?.docs?.length ?? 0;
      if (res.status < 400 || updated > 0) {
        toast.success(
          updated > 0
            ? `Опубликовано: ${updated}`
            : "Подходящих черновиков среди выделенных не найдено",
        );
        if (json?.errors?.length) {
          toast.error(
            json.message || "Часть записей не удалось опубликовать",
            {
              description: json.errors
                .map((error) => error.message)
                .filter(Boolean)
                .join("\n"),
            },
          );
        }
        toggleAll();
        clearRouteCache();
        router.refresh();
        return;
      }

      if (json?.errors?.length) {
        for (const error of json.errors) {
          if (error.message) toast.error(error.message);
        }
        return;
      }
      toast.error("Не удалось опубликовать выделенное");
    } catch {
      toast.error("Не удалось опубликовать выделенное");
    }
  }, [
    api,
    clearRouteCache,
    collectionSlug,
    getQueryParams,
    router,
    toggleAll,
  ]);

  if (count === 0) return null;

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <Button
        buttonStyle="secondary"
        onClick={() => openModal(modalSlug)}
        size="small"
      >
        {`Опубликовать выделенное (${count})`}
      </Button>
      <ConfirmationModal
        body={`Будут опубликованы черновики среди выделенных записей (${count}). Если запись не проходит проверки публикации, она останется черновиком.`}
        cancelLabel="Отмена"
        confirmingLabel="Публикация…"
        confirmLabel="Опубликовать"
        heading="Опубликовать выделенное"
        modalSlug={modalSlug}
        onConfirm={handlePublish}
      />
    </div>
  );
}
