import { fakerKO, faker } from "@faker-js/faker";

// Random domain pool (test friendly)
const domains = ["local.test", "makeshop.dev", "example.com"];

export const generateTestUser = () => {
  // 한국 이름
  const name = `${fakerKO.person.lastName()}${fakerKO.person.firstName()}`;

  // 로그인ID: 영문이면서 간결하게
  const uidSource = faker.internet.username(); // 영문 기반
  const loginUid = uidSource
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);

  // 이메일: 이름 일부 + uid + 안정적 도메인
  const emailLocal = loginUid;
  const domain = faker.helpers.arrayElement(domains);

  return {
    loginUid: `${loginUid}_faker`,
    password: `${loginUid}_faker`,
    email: `${emailLocal}_faker@${domain}`,
    name,
    phone: `010${faker.string.numeric(4)}${faker.string.numeric(4)}`,
  };
};
