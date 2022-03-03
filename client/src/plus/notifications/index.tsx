import { useContext, useEffect, useState } from "react";
import { useLocale } from "../../hooks";
import Container from "../../ui/atoms/container";
import Tabs from "../../ui/molecules/tabs";

import {
  searchFiltersContext,
  SearchFiltersProvider,
} from "../contexts/search-filters";
import "./index.scss";

import { useApiEndpoint } from "./api";

import { Loading } from "../../ui/atoms/loading";
import { DataError, NotSignedIn } from "../common";
import { useUserData } from "../../user-context";
import { TAB_INFO, useCurrentTab } from "./tabs";
import { NotificationsTab } from "./notifications-tab";

function NotificationsLayout() {
  const locale = useLocale();
  const userData = useUserData();

  const {
    selectedTerms,
    selectedFilter,
    selectedSort,
    setSelectedTerms,
    setSelectedFilter,
    setSelectedSort,
    getSearchFiltersParams,
  } = useContext(searchFiltersContext);

  const currentTab = useCurrentTab(locale);

  const showTabs = userData && userData.isAuthenticated;
  const isAuthed = userData?.isAuthenticated;

  const [offset, setOffset] = useState(0);

  const { data, error, isLoading, hasMore } = useApiEndpoint(
    offset,
    selectedTerms,
    selectedFilter,
    getSearchFiltersParams,
    selectedSort,
    currentTab
  );

  useEffect(() => {
    setSelectedSort("");
    setSelectedTerms("");
    setSelectedFilter("");
    setOffset(0);
  }, [currentTab]);

  useEffect(() => {
    setOffset(0);
  }, [selectedTerms, selectedFilter, selectedSort]);

  return (
    <>
      <header className="plus-header">
        <Container>
          <h1>Notifications</h1>
        </Container>
        <Tabs
          tabs={[...TAB_INFO.values()].map((val) => {
            return { ...val, path: `/${locale}${val.path}` };
          })}
        />
      </header>
      {isLoading && <Loading message="Waiting for data" />}
      {showTabs && (
        <Container>
          <>
            <NotificationsTab
              currentTab={currentTab}
              selectedTerms={selectedTerms}
              selectedFilter={selectedFilter}
              selectedSort={selectedSort}
              setOffset={setOffset}
              offset={offset}
              data={data}
              hasMore={hasMore}
            />
          </>
          {!userData && <Loading message="Waiting for authentication" />}
          {!userData && !isAuthed && <NotSignedIn />}
          {error && <DataError error={error} />}
        </Container>
      )}
    </>
  );
}

export default function Notifications() {
  return (
    <SearchFiltersProvider>
      <NotificationsLayout />
    </SearchFiltersProvider>
  );
}
