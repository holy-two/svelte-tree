import "../dist/mow-tree.es.js";

const tree = document.querySelector(".custom-tree");

tree.tree = [
  {
    text: "选项1",
    children: [
      {
        text: "选项2",
      },
      {
        text: "选项4",
        children: [
          {
            text: "选项5",
          },
        ],
      },
    ],
  },
  {
    text: "选项3",
  },
];

tree.$on("itemToggle", (e) => {
  console.log("itemToggle", e);
});

tree.$on("leafClick", (e) => {
  console.log("leafClick", e);
});
