// Explicit shapes — JSON inference on nested arrays is fragile.
export interface Branch {
  name: string;
  saturday: string;
  sunThu: string;
  friday: string;
}

export interface BranchGroup {
  title: string;
  branches: Branch[];
}