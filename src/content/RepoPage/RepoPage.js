import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Link, DataTableSkeleton, Pagination } from 'carbon-components-react';
import RepoTable from './RepoTable';

const LinkList = ({ url, homepageUrl }) => (
  <ul style={{ display: 'flex' }}>
    <li>
      <Link href={url}>GitHub</Link>
    </li>
    {homepageUrl && (
      <li>
        <span>&nbsp;|&nbsp;</span>
        <Link href={homepageUrl}>Homepage</Link>
      </li>
    )}
  </ul>
);

const REPO_QUERY = gql`
  query REPO_QUERY {
    # Let's use carbon as our organization
    organization(login: "carbon-design-system") {
      # We'll grab all the repositories in one go. To load more resources
      # continuously, see the advanced topics.
      repositories(first: 75, orderBy: { field: UPDATED_AT, direction: DESC }) {
        totalCount
        nodes {
          url
          homepageUrl
          issues(filterBy: { states: OPEN }) {
            totalCount
          }
          stargazers {
            totalCount
          }
          releases(first: 1) {
            totalCount
            nodes {
              name
            }
          }
          name
          updatedAt
          createdAt
          description
          id
        }
      }
    }
  }
`;

const getRowItems = rows =>
  rows.map(row => ({
    ...row,
    key: row.id,
    stars: row.stargazers.totalCount,
    issueCount: row.issues.totalCount,
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    updatedAt: new Date(row.updatedAt).toLocaleDateString(),
    links: <LinkList url={row.url} homepageUrl={row.homepageUrl} />,
  }));

const headers = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'createdAt',
    header: 'Created',
  },
  {
    key: 'updatedAt',
    header: 'Updated',
  },
  {
    key: 'issueCount',
    header: 'Open Issues',
  },
  {
    key: 'stars',
    header: 'Stars',
  },
  {
    key: 'links',
    header: 'Links',
  },
];

const RepoPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  return (
    <div className="repo-page">
      <div className="repo-page_r1">
        <div className="bx--col-lg-16">
          <Query query={REPO_QUERY}>
            {({ loading, error, data }) => {
              // Wait for the request to complete
              if (loading)
                return (
                  <DataTableSkeleton
                    columnCount={headers.length + 1}
                    rowCount={10}
                    headers={headers}
                  />
                );
              // Something went wrong with the data fetching
              if (error) return `Error! ${error.message}`;
              // If we're here, we've got our data!

              let rows = [];
              if (data) {
                setTotalItems(data.organization.repositories.totalCount);
                rows = getRowItems(data.organization.repositories.nodes);
              }

              return (
                <>
                  <RepoTable
                    headers={headers}
                    rows={rows.slice(
                      firstRowIndex,
                      firstRowIndex + currentPageSize
                    )}
                  />
                  <Pagination
                    totalItems={totalItems}
                    backwardText="Previous page"
                    forwardText="Next page"
                    pageSize={currentPageSize}
                    pageSizes={[5, 10, 15, 25]}
                    itemsPerPageText="Items per page"
                    onChange={({ page, pageSize }) => {
                      if (pageSize !== currentPageSize) {
                        setCurrentPageSize(pageSize);
                      }
                      setFirstRowIndex(pageSize * (page - 1));
                    }}
                  />
                </>
              );
            }}
          </Query>
        </div>
      </div>
    </div>
  );
};

export default RepoPage;
