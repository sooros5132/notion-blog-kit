import _ from 'lodash';
import { formItemType, formPageType, formSectionType, IForm, IFormGet } from 'src/types/form';

export async function handleFormMaker(findForm: IFormGet) {
  try {
    const form: Omit<IForm, 'ownerNanoid'> = {
      nanoid: findForm.nanoid,
      ownerId: findForm.ownerId,
      title: findForm.title,
      subTitle: findForm.subTitle,
      description: findForm.description,
      isPublished: findForm.isPublished,
      isRequiredLogin: findForm.isRequiredLogin,
      createdAt: findForm.createdAt,
      updatedAt: findForm.updatedAt,
      requiredResponseFormId: findForm.requiredResponseFormId,
      pageIds: [],
      pages: {},
      sections: {},
      items: {},
      itemOptions: {}
    };

    form.pageIds = findForm.pages.map((page) => page.id);

    findForm.pages.forEach((page) => {
      form.pages[page.id] = {
        id: page.id,
        sequence: page.sequence,
        type: page.pageType.type as keyof typeof formPageType,
        sectionIds: page.sections.map((section) => section.id)
      };
    });

    for (const page of findForm.pages) {
      if (!form.sections) form.sections = {};
      page.sections.forEach((section) => {
        form.sections[section.id] = {
          id: section.id,
          sequence: section.sequence,
          title: section.title,
          description: section.description,
          required: section.required,
          loadSectionId: section.loadSectionId,
          type: section.sectionType.type as keyof typeof formSectionType,
          itemIds: section.items.map((item) => item.id)
        };
      });

      for (const section of page.sections) {
        if (!form.items) form.items = {};
        section.items.forEach((item) => {
          form.items[item.id] = {
            id: item.id,
            sequence: item.sequence,
            setting: item.setting,
            sectionId: item.sectionId,
            required: item.required,
            type: item.itemType.type as keyof typeof formItemType,
            itemOptionIds: item.itemOptions.map((itemOption) => itemOption.id)
          };
        });

        for (const item of section.items) {
          if (!form.itemOptions) form.itemOptions = {};
          item.itemOptions.forEach((itemOption) => {
            form.itemOptions[itemOption.id] = itemOption;
          });
        }
      }
    }
    return form;
  } catch (e) {
    throw e;
  }
}
