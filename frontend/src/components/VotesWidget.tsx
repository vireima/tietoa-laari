import { IconThumbUp } from "@tabler/icons-react";
import { ExtendedTask } from "../types/Task";
import { Box, HoverCard, Text } from "@mantine/core";
import { userDisplayName } from "../api/getUsers";
import { Infopill } from "./Infopill";

export default function VotesWidget({ task }: { task: ExtendedTask }) {
  if (task.votes.length > 1)
    return (
      <HoverCard>
        <HoverCard.Target>
          <Box
          // style={{ backgroundColor: "var(--mantine-primary-color-filled)" }}
          >
            <Infopill
              Icon={IconThumbUp}
              text={task.votes.length.toString()}
              tooltip="Slack-reaktioita"
              bg="var(--mantine-primary-color-light)"
              pl="0.3rem"
              pr="0.8rem"
              style={{ borderRadius: "1rem" }}
            />
          </Box>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {task.votes.map((vote, index) => (
            <Text key={index}>
              {vote.reaction} {userDisplayName(vote.user)}
            </Text>
          ))}
        </HoverCard.Dropdown>
      </HoverCard>
    );
}
