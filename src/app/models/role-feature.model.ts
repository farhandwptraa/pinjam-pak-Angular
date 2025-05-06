export interface Role {
    roleId: number;
    namaRole: string;
  }
  
  export interface Feature {
    featureId: number;
    namaFeature: string;
  }
  
  export interface RoleFeatureDTO {
    roleId: number;
    featureIds: number[];
  }  