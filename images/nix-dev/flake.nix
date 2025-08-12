{
  description = "Dev environment with supporting tools";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/4ae2e647537bcdbb82265469442713d066675275";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_18
          ];
        };
      });
}
