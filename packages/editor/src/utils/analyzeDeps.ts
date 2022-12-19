import axios from "axios";

import {getPathValue} from "./index";

const regex = /import\s([\s\S]*?)\sfrom\s('|")((@\w[\w\.\-]+\/)?(\w[\w\.\-]+))(\/[\w\.\-]+)*\2/gm;

const getPkg = (code: string, excludePkg: string[]): string[] => {
  let matchRet = null;
  const pkgNames: string[] = [];
  while ((matchRet = regex.exec(code)) != null) {
    const pkgName = matchRet[3];
    if (!excludePkg?.includes(pkgName)) {
      pkgNames.push(pkgName);
    }
  }
  return pkgNames;
};

const getPkgLatestVersion = (pkg: string): Promise<string[]> => {
  return axios
    .get(`/${pkg}`, {
      baseURL: "https://registry.npmjs.com/",
    })
    .then((res: any) => {
      return [
        pkg,
        getPathValue<string, any>(res, ["data", "dist-tags", "latest"]) || "*",
      ];
    })
    .catch(() => {
      return [pkg, "*"];
    });
};

const analyzeDeps = (
  code: string,
  excludePkg?: string[]
): Promise<{ [pkgName: string]: string }> => {
  const pkgArr = getPkg(code, excludePkg || []);
  return Promise.allSettled(pkgArr.map((pkg) => getPkgLatestVersion(pkg))).then(
    (settledResult) => {
      const record: {
        [key: string]: any;
      } = {};

      const errorPkg: string[] = [];

      settledResult.forEach((res) => {
        if (res.status === "fulfilled") {
          const [pkg, version] = res.value || [];
          if (version !== "*") {
            record[pkg] = `^${version}`;
          } else {
            errorPkg.push(pkg);
          }
        } else {
          const [pkg] = res.reason || [];
          errorPkg.push(pkg);
        }
      });

      record["errorPkg"] = errorPkg;

      return record;
    }
  );
};

export default analyzeDeps;
