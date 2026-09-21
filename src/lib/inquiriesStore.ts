export interface InquiryData {
  id: string;
  inquiryId: string;
  name: string;
  phone: string;
  deitySize: string;
  inquiryType: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryInquiriesStore: InquiryData[] | undefined;
}

if (!global.memoryInquiriesStore) {
  global.memoryInquiriesStore = [
    {
      id: 'INQ-101',
      inquiryId: 'INQ-101',
      name: 'Pooja Agarwal',
      phone: '9820123456',
      deitySize: '2',
      inquiryType: 'Poshak & Sizing Advice',
      message: 'Need help selecting the perfect Janmashtami poshak for my No. 2 Bal Gopal.',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
}

export const getMemoryInquiries = (): InquiryData[] => {
  if (!global.memoryInquiriesStore) {
    global.memoryInquiriesStore = [];
  }
  return global.memoryInquiriesStore;
};

export const addMemoryInquiry = (inquiry: InquiryData) => {
  const current = getMemoryInquiries();
  global.memoryInquiriesStore = [inquiry, ...current];
  return inquiry;
};

export const updateMemoryInquiryStatus = (id: string, status: 'new' | 'replied' | 'closed') => {
  const current = getMemoryInquiries();
  const inq = current.find((i) => i.id === id || i.inquiryId === id);
  if (inq) {
    inq.status = status;
    global.memoryInquiriesStore = [...current];
    return inq;
  }
  return null;
};

export const deleteMemoryInquiry = (id: string) => {
  const current = getMemoryInquiries();
  global.memoryInquiriesStore = current.filter((i) => i.id !== id && i.inquiryId !== id);
  return true;
};
