import { UserCurrent } from "src/app/auth/interfaces/user.interface";
import { DiagramsResponse } from "./diagrams-response.interface";

export interface AddCollaboratorResponse {
  newCollaborator: UserCurrent;
  diagram:         DiagramsResponse;
}


