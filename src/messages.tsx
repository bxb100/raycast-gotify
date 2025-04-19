import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useApplication } from "./hooks/useApplication";
import { useMessage } from "./hooks/useMessage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect } from "react";
import { useCachedState } from "@raycast/utils";

dayjs.extend(relativeTime);

export default function Command() {
  const [selectApp, setSelectApp] = useCachedState("select-app", "all");

  const { applications, applicationLoading } = useApplication();

  const { messages, messageLoading, messagePagination, revalidate, deleteMessage } = useMessage({ id: selectApp });

  const getAppName = useCallback(
    (appid: number) => {
      return applications?.find((d) => d.id === appid)?.name;
    },
    [applications],
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      revalidate();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [revalidate]);

  return (
    <List
      pagination={messagePagination}
      isLoading={applicationLoading || messageLoading}
      isShowingDetail={true}
      searchBarAccessory={
        <List.Dropdown tooltip="Select Applications" onChange={setSelectApp} value={selectApp}>
          <List.Dropdown.Item title="ALL" value="all" />
          <List.Dropdown.Section>
            {applications?.map((app) => <List.Dropdown.Item key={app.id} title={app.name} value={String(app.id)} />)}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
      actions={
        <ActionPanel>
          <Action title={"Refresh"} icon={Icon.ArrowClockwise} onAction={() => revalidate()} />
        </ActionPanel>
      }
    >
      {messages?.map((message) => (
        <List.Item
          icon={"apple-touch-icon-60x60.png"}
          key={message.id}
          title={message.title}
          detail={
            <List.Item.Detail
              markdown={message.message}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="from" text={getAppName(message.appid)} />
                  <List.Item.Detail.Metadata.Label title="date" text={dayjs(message.date).fromNow(true) + " ago"} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Message" content={message.message} />
              <Action
                title={"Delete Message"}
                icon={Icon.Trash}
                onAction={() => deleteMessage(message.id)}
                style={Action.Style.Destructive}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
