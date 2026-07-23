export const MEMBERS = {
  sen: {
    name: "센 카르멘",
  },
  nir: {
    name: "니르",
  },
  haren: {
    name: "하렌 루베오스",
  },
};

export const MEMBER_IDS = Object.keys(MEMBERS);

export const MEMBER_FILTERS = [
  { key: "ALL", label: "전체" },
  ...MEMBER_IDS.map((id) => ({
    key: id,
    label: MEMBERS[id].name,
  })),
];

export function isValidMemberId(value) {
  return MEMBER_IDS.includes(value);
}

export function normalizeMembers(value) {
  const rawMembers = Array.isArray(value) ? value : [value];
  const members = rawMembers
    .map((member) => {
      if (member && typeof member === "object") {
        return String(member.member ?? "").trim();
      }

      return String(member ?? "").trim();
    })
    .filter(isValidMemberId);

  return members.length > 0 ? members : ["haren"];
}

export function getEntryMembers(entry) {
  return normalizeMembers(entry?.members ?? entry?.member);
}

export function getMemberLabels(entry) {
  return getEntryMembers(entry).map((member) => MEMBERS[member].name);
}

export function matchesMemberFilter(entry, activeMember) {
  return activeMember === "ALL" || getEntryMembers(entry).includes(activeMember);
}
