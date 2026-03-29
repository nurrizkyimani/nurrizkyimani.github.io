interface MenuLink {
  link: string;
  icon: string;
  info: string;
}

const useMenuLink = (hideProjects: boolean): MenuLink[] => {
  const links: MenuLink[] = [
    {
      link: `#home`,
      icon: `🏡`,
      info: `Home`
    },
    {
      link: `#experience`,
      icon: `🧳`,
      info: `Experiences`
    },
    {
      link: '#stack',
      icon: `🛠`,
      info: `Stacks`
    },
    {
      link: '#about',
      icon: `👨‍🚀`,
      info: 'About'
    },
  ];

  if (!hideProjects) {
    links.splice(1, 0, {
      link: '#project',
      icon: `📂`,
      info: `Projects`
    });
  }

  return links;
}

export default useMenuLink;
