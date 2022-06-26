import { formItemType, formSectionType, IForm, IFormFile } from 'src/types/form';

export default function handleFormResponseToTable(
  form: Omit<IForm, 'ownerNanoid'>,
  response: any,
  show?: {
    companyInfo: boolean;
  }
) {
  try {
    const columns = {} as Record<
      string,
      | any
      | { sectionId: number; title: string; type: keyof typeof formSectionType }
      | Record<number, { itemId: number; title: string; type: keyof typeof formItemType }>
    >;
    const rows = {} as Record<
      string,
      Record<
        string,
        any | string | Record<string, string>
        // {
        //   id: number;
        //   sectionId: number;
        //   sectionType: string;
        //   itemType: string;
        //   itemId: string;
        //   response: string;
        //   formResponseAttachment?: Array<{
        //     originalName: string;
        //     size: number;
        //   }>;
        // }
      >
    >;

    const pages = Object.values(form.pages);
    // columns 생성
    for (const page of pages) {
      const sections = page.sectionIds.map((id) => form.sections[id]);
      for (const section of sections) {
        const items = section.itemIds.map((id) => form.items[id]);
        const type = section.type;
        switch (type) {
          case 'RADIO':
          case 'CHECKBOX':
          case 'TEXT':
          case 'FILE': {
            columns[section.id] = {
              sectionId: section.id,
              title: section.title,
              type: type
            };

            break;
          }
          case 'COLUMN_TABLE': {
            const sectionType = section.type;
            columns[section.id] = {};
            columns[section.id].sectionId = section.id;
            columns[section.id].title = section.title;
            columns[section.id].type = sectionType;
            columns[section.id].columns = {};
            for (const item of items) {
              const type = item.type;
              const setting = item.setting;
              columns[section.id]['columns'][item.id] = {
                itemId: item.id,
                type: type,
                title: setting[0]
              };
            }

            break;
          }
        }
      }
    }

    // rows 생성
    for (const formResponses of response) {
      const nanoid = formResponses.nanoid;
      rows[nanoid] = {};
      rows[nanoid]['createdAt'] = formResponses.createdAt;
      rows[nanoid]['updatedAt'] = formResponses.updatedAt;
      rows[nanoid]['respondent'] = formResponses?.user?.nanoid || '익명';

      if (show?.companyInfo && formResponses?.user?.ownerCompany) {
        rows[nanoid]['company'] = formResponses?.user?.ownerCompany.name;
        rows[nanoid]['companyNanoid'] = formResponses?.user?.ownerCompany.nanoid;
      }
      for (const itemResponse of formResponses.formResponseItems) {
        const sectionId = itemResponse.item.section.id;
        const sectionType = itemResponse.item.section.sectionType
          .type as keyof typeof formSectionType;
        const itemType = itemResponse.item.itemType.type as keyof typeof formItemType;
        const itemId = itemResponse.itemId;
        switch (sectionType) {
          case 'TEXT':
          case 'RADIO': {
            rows[nanoid][sectionId] = itemResponse.data as string;
            break;
          }
          case 'CHECKBOX': {
            if (!rows[nanoid][sectionId]) rows[nanoid][sectionId] = [];

            rows[nanoid][sectionId].push(itemResponse.data);
            break;
          }
          case 'FILE': {
            if (!rows[nanoid][sectionId]) rows[nanoid][sectionId] = [];
            const data = itemResponse.formResponseAttachment as Array<IFormFile>;

            if (Array.isArray(data) && data[0]) {
              rows[nanoid][sectionId].push(data[0]);
            }

            break;
          }
          case 'COLUMN_TABLE': {
            if (!rows[nanoid][sectionId]) rows[nanoid][sectionId] = [];

            switch (itemType) {
              case 'TABLE_CHECKBOX': {
                break;
              }
              case 'TABLE_SELECT_ONCE':
              case 'TABLE_SELECT_MANY': {
                for (const responseOption of itemResponse.formResponseItemOptions) {
                  const rowIndex = Array.isArray(itemResponse?.data) && itemResponse.data[0];

                  const { id, itemOptionId } = responseOption as {
                    id: number;
                    itemOptionId: number;
                  };

                  if (responseOption?.itemOptionId && typeof rowIndex === 'number') {
                    if (typeof rowIndex !== 'number') continue;
                    if (!rows[nanoid][sectionId][rowIndex]) rows[nanoid][sectionId][rowIndex] = {};
                    if (!rows[nanoid][sectionId][rowIndex][itemId]) {
                      rows[nanoid][sectionId][rowIndex][itemId] = {};
                    }
                    rows[nanoid][sectionId][rowIndex][itemId][id] = itemOptionId;
                  }
                }
                break;
              }
              case 'TABLE_TEXT': {
                const [rowIndex, data] = itemResponse.data as [number, any];
                if (typeof rowIndex === 'number') {
                  if (!rows[nanoid][sectionId][rowIndex]) rows[nanoid][sectionId][rowIndex] = {};
                  rows[nanoid][sectionId][rowIndex][itemId] = data as string;
                }
                break;
              }
            }
            break;
          }
        }
      }
    }

    return {
      rows,
      columns
    };
  } catch (e) {
    throw e;
  }
}
