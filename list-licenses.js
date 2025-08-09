const fs = require('fs');
const data = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));

function collectLicenses(node, result = {}) {
  if (node && node.dependencies) {
    for (const [name, dep] of Object.entries(node.dependencies)) {
      if (dep && dep.license && !result[name]) {
        result[name] = dep.license;
      } else if (dep && dep.licenses && !result[name]) {
        result[name] = dep.licenses;
      } else if (dep && dep.licenseText && !result[name]) {
        result[name] = dep.licenseText;
      }
      collectLicenses(dep, result);
    }
  }
  return result;
}

const licenses = collectLicenses(data);
for (const [pkg, license] of Object.entries(licenses)) {
  console.log(`${pkg}: ${license}`);
}
