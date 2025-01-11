import type { Delta } from "$lib/deltas/delta";
import type { RequestBody as PatchWorldBody } from "$lib/types/api/patch";

const API_BASE_PATH = "/api";

export class Client {
  protected worldCUID: string;

  constructor(worldCUID: string) {
    this.worldCUID = worldCUID;
  }

  public async patchWorld(deltas: Delta[]) {
    const body: PatchWorldBody = {
      // TODO: author
      deltas,
    };

    fetch(`${API_BASE_PATH}/worlds/${this.worldCUID}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
      .then(() => console.log("Successfully patched world"))
      .catch(error => {
        this.handleError(error);
      });
  }

  protected handleError(error: Error) {
    console.error(error);
  }
}
