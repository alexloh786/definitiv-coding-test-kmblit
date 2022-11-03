import './style.scss';

interface ICategory {
  key: string;
  label: string;
  sort?: number;
  parent?: string;
}

interface IEntityType {
  name: string;
  sort?: number;
  category?: string;
  url: string;
}

const categories: ICategory[] = [
  { key: 'search', label: 'Search', sort: 1 },
  { key: 'address-search', label: 'Address search', sort: 2, parent: 'search' },
  {
    key: 'position-search',
    label: 'Position search',
    sort: 1,
    parent: 'search',
  },
  { key: 'settings', label: 'Settings', sort: 99 },
];

const entityTypes: IEntityType[] = [
  { name: 'Home', url: '/' },
  {
    name: 'Employee search',
    category: 'position-search',
    url: '/search/position-search/employee',
  },
  { name: 'Users', category: 'settings', url: '/settings/user' },
  {
    name: 'Street address search',
    category: 'address-search',
    url: '/search/address-search/street',
  },
  {
    name: 'City search',
    sort: 1,
    category: 'address-search',
    url: '/search/address-search/city',
  },
];

const desiredOutcome = [
  {
    class: 'category',
    name: 'Search',
    children: [
      {
        class: 'category',
        name: 'Position search',
        children: [
          {
            class: 'entity',
            name: 'Employee search',
            url: '/search/position-search/employee',
          },
        ],
      },
      {
        class: 'category',
        name: 'Address search',
        children: [
          {
            class: 'entity',
            name: 'City search',
            url: '/search/address-search/city',
          },
          {
            class: 'entity',
            name: 'Street address search',
            url: '/search/address-search/street',
          },
        ],
      },
    ],
  },
  {
    class: 'entity',
    name: 'Home',
    url: '/',
  },
  {
    class: 'category',
    name: 'Settings',
    children: [
      {
        class: 'entity',
        name: 'Users',
        url: '/settings/user',
      },
    ],
  },
];

function buildResults() {
  let sortedCategoies = categories.sort((a, b) => (a.sort < b.sort ? -1 : 1));

  let res = [];
  for (let i = 0; i < sortedCategoies.length; i++) {
    // Start from Parent categories
    if (sortedCategoies[i].parent == null) {
      // Get any child categories under this parent
      let childCategories = categories
        .filter((obj) => {
          return obj.parent == sortedCategoies[i].key;
        })
        .sort((a, b) => (a.sort < b.sort ? -1 : 1));

      let childCategorieArray = [];
      for (let i = 0; i < childCategories.length; i++) {
        // Get child entities belonging to the child category
        let childEntities = entityTypes
          .filter((obj) => {
            return obj.category == childCategories[i].key;
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));

        // populate child entities
        let childEntitiesArray = [];
        for (let i = 0; i < childEntities.length; i++) {
          childEntitiesArray.push({
            class: 'entity',
            name: childEntities[i].name,
            url: childEntities[i].url,
          });
        }

        // Add child categories under the parent
        childCategorieArray.push({
          class: 'category',
          name: childCategories[i].label,
          children: childEntitiesArray,
        });
      }

      if (childCategories.length > 0) {
        res.push({
          class: 'category',
          name: sortedCategoies[i].label,
          children: childCategorieArray,
        });
      } else {
        res.push({ class: 'category', name: sortedCategoies[i].label });
      }
    }
  }
  
  // Add no category entities
  let noCategoryEntity = entityTypes
    .filter((obj) => {
      return obj.category == null;
    })
    .sort((a, b) => (a.sort < b.sort ? -1 : 1));

  for (let i = 0; i < noCategoryEntity.length; i++) {
    res.push({
      class: 'entity',
      name: noCategoryEntity[i].name,
      url: noCategoryEntity[i].url,
    });
  }

  return res;
}

// Place your solution in the `results` constant here.
const results = buildResults();

// Do not modify the below code. It simply outputs the result.
document.querySelector('#results').innerHTML = JSON.stringify(
  results,
  null,
  '    '
);

const doesMatchEl = document.querySelector('#doesMatch');
if (JSON.stringify(desiredOutcome) === JSON.stringify(results)) {
  doesMatchEl.classList.add('match');
  doesMatchEl.innerHTML = 'Matches! Congratulations.';
} else {
  doesMatchEl.classList.add('no-match');
  doesMatchEl.innerHTML = 'Does not match, keep trying.';
}
