import React from "react";

export type CriteriaRefContainer = {
    id: string;
    name: React.RefObject<HTMLInputElement>;
    type: React.RefObject<HTMLSelectElement>;
    values: React.RefObject<HTMLInputElement>;
    multi: React.RefObject<HTMLInputElement>;
    weight: React.RefObject<HTMLInputElement>;
}