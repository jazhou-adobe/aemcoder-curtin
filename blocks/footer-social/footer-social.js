export default async function decorate(block) {
  // Social links are rendered as plain anchor elements in a flex row
  const wrapper = block.querySelector('div > div');
  if (wrapper) {
    const links = [...wrapper.querySelectorAll('a')];
    wrapper.innerHTML = '';
    links.forEach((link) => {
      wrapper.append(link);
    });
  }
}
