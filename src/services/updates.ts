import * as Updates from "expo-updates";

export type AppUpdateStatus =
  | { status: "disabled"; message: string }
  | { status: "current"; message: string }
  | { status: "downloaded"; message: string }
  | { status: "error"; message: string };

export function getUpdateInfo() {
  return {
    enabled: Updates.isEnabled,
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    updateId: Updates.updateId,
    createdAt: Updates.createdAt,
    embedded: Updates.isEmbeddedLaunch,
  };
}

export async function checkForAppUpdate(): Promise<AppUpdateStatus> {
  if (__DEV__ || !Updates.isEnabled) {
    return {
      status: "disabled",
      message: "As atualizações OTA ficam ativas no APK instalado, não no modo de desenvolvimento.",
    };
  }

  try {
    const check = await Updates.checkForUpdateAsync();

    if (!check.isAvailable) {
      return {
        status: "current",
        message: "Você já está usando a versão mais recente disponível.",
      };
    }

    const result = await Updates.fetchUpdateAsync();

    if (result.isNew) {
      return {
        status: "downloaded",
        message: "Atualização baixada. Reinicie o Vereda para aplicar agora.",
      };
    }

    return {
      status: "current",
      message: "Nenhuma atualização nova precisa ser aplicada.",
    };
  } catch (error) {
    const details = error instanceof Error ? error.message : "erro desconhecido";
    return {
      status: "error",
      message: `Não foi possível verificar atualizações (${details}).`,
    };
  }
}

export async function applyDownloadedUpdate() {
  if (__DEV__ || !Updates.isEnabled) return;
  await Updates.reloadAsync();
}
