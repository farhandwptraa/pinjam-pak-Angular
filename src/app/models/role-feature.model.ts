export interface Role {
  roleId: string;
  namaRole: string;
}

export interface Feature {
  featureId: string;
  namaFeature: string;
}
  
export interface RoleFeatureDTO {
  roleId: string;
  featureIds: string[];
}