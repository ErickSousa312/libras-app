import { Action, TypeLibrasData } from '@/@types/LibrasData';

export function DataLibrasReducer(
  data: TypeLibrasData[],
  action: Partial<Action>,
): TypeLibrasData[] {
  switch (action.type) {
    case 'addedMultiple ': {
      return [...data!];
    }
    case 'teste': {
      console.log(data);
      return [...data!];
    }
    case 'added': {
      return [
        ...data!,
        {
          id: action.payload?.id!,
          nameWord: action.payload?.nameWord!,
          wordDefinitions: action.payload?.wordDefinitions!,
        },
      ];
    }
    case 'changed': {
      return data?.map((t) => {
        if (t.id === action.payload?.id) {
          return action.payload;
        } else {
          return t;
        }
      }) as TypeLibrasData[];
    }
    case 'changed2': {
      const updatedData = data.map((item) => {
        if (item.id === action.payload?.id) {
          const updatedDefinitions = item.wordDefinitions.map(
            (wordDefinition, index) => {
              const foundDefinition = action.payload?.wordDefinitions.find(
                (updatedDefinition) =>
                  updatedDefinition.id === wordDefinition.id,
              );

              if (foundDefinition) {
                return {
                  ...foundDefinition,
                  category: {
                    nameCategory: foundDefinition.category.nameCategory,
                  },
                };
              }
              return wordDefinition;
            },
          );
          console.log(updatedDefinitions);
          return { ...item, wordDefinitions: updatedDefinitions };
        }
        return item;
      });
      return updatedData as TypeLibrasData[];
    }

    case 'deleted': {
      return data?.filter(
        (t) => t.nameWord !== action.payload?.nameWord,
      ) as TypeLibrasData[];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export const initialStateDataLibrasReducer: TypeLibrasData[] = [];