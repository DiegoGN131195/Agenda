import { PermissionType } from "../enums/permission-type.enum";
import { Agenda } from "./agenda";

export class AgendaDialog{
    agenda: Agenda;
    permissionType: PermissionType;
    title: string;
}