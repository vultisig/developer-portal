import { Stack, VStack } from "@/toolkits/Stack";

export const MainPage = () => {
  return (
    <VStack $style={{ alignItems: "center", flexGrow: "1" }}>
      <VStack
        $style={{
          gap: "48px",
          maxWidth: "1200px",
          padding: "16px",
          width: "100%",
        }}
      >
        <VStack $style={{ gap: "16px" }}>
          <Stack
            $style={{
              backgroundImage: "url(/images/mainbanner.jpg)",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              borderRadius: "16px",
              height: "336px",
            }}
          />
        </VStack>
        <VStack $style={{ flexGrow: "1", gap: "32px" }}></VStack>
      </VStack>
    </VStack>
  );
};
