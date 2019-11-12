import React from 'react';
import styled from '@emotion/styled';
import { Link, NavLink } from 'react-router-dom';

const Container = styled('div')`
  height: 100%;
  min-width: 350px;
  max-width: 350px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  min-height: 5em;
`;

const TitleArea = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled(Link)`
  display: block;
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
  text-decoration: none;
  color: black;
`;

const Description = styled('div')`
  max-width: 100%;
  color: #c6c6c6;
  font-size: 18px;
  padding: 20px;
`;

const SectionTitle = styled('h3')`
  font-size: 20px;
  font-weight: lighter;
  margin: 0;
  margin-left: 15px;
  margin-bottom: 15px;
`;

const SectionItem = styled(NavLink)`
  font-size: 18px;
  font-weight: lighter;
  color: #8c8c8c;
  margin: 0;
  margin-left: 25px;
  margin-bottom: 15px;
  text-decoration: none;

  &:hover {
    color: #595656;
  }
`;

export default class Sidebar extends React.Component {
  render() {
    const { sections } = this.props;

    return (
      <Container>
        <TitleArea>
          <Title to="/">React Split Pane</Title>
          <a
            className="github-button"
            href="https://github.com/tomkp/react-split-pane"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star tomkp/react-split-pane on GitHub"
          >
            Star
          </a>
        </TitleArea>
        <Description>
          A component that makes creating draggable and resizable UI a breeze
        </Description>
        {sections.map(section => (
          <React.Fragment>
            <SectionTitle>{section.title}</SectionTitle>
            {section.items.map(item => (
              <SectionItem to={item.url} activeStyle={{ color: '#cb659c' }}>
                {item.title}
              </SectionItem>
            ))}
          </React.Fragment>
        ))}
      </Container>
    );
  }
}

Sidebar.defaultProps = {
  sections: [
    {
      title: 'Basic Usage',
      items: [
        {
          title: 'Basic Horizontal',
          url: '/basic-horizontal',
        },
        {
          title: 'Basic Vertical',
          url: '/basic-vertical',
        },
        {
          title: 'Basic Step',
          url: '/basic-step',
        },
        {
          title: 'Basic Nested',
          url: '/basic-nested',
        },
        {
          title: 'Percentage Vertical',
          url: '/percentage-vertical',
        },
        {
          title: 'Percentage Horizontal',
          url: '/percentage-horizontal',
        },
        {
          title: 'Snap to Position',
          url: '/snap-position',
        },
      ],
    },
    {
      title: 'Advanced Usage',
      items: [
        {
          title: 'Inline styles',
          url: '/inline-styles',
        },
        {
          title: 'Multiple Panes Vertical',
          url: '/multiple-vertical',
        },
        {
          title: 'Multiple Panes Horizontal',
          url: '/multiple-horizontal',
        },
        {
          title: 'Nested Vertically in Container',
          url: '/nested-vertical',
        },
        {
          title: 'Nested Horizontally in Container',
          url: '/nested-horizontal',
        },
        {
          title: 'Subcomponent',
          url: '/subcomponent',
        },
      ],
    },
  ],
};
