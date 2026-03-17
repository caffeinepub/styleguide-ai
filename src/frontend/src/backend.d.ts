import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StyleRecommendation {
    glasses: Array<string>;
    hairstyles: Array<string>;
    faceShape: string;
    shoes: Array<string>;
    clothingColors: Array<string>;
    skinTone: string;
}
export interface backendInterface {
    analyzeImage(_image: Uint8Array): Promise<StyleRecommendation>;
    getRecentRecommendations(): Promise<Array<StyleRecommendation>>;
}
