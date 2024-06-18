import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Portal } from "~/components/primitives/portal";
import * as ToastPrimitive from "~/components/primitives/toast";
import { Button } from "~/components/ui/button";
import { useToastStore } from "~/stores/toaster-store";

export default function ToastNotification() {
  const { open, setOpen, title, message } = useToastStore();
  const [seconds, setSeconds] = useState(3);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (open) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setOpen(false);
            if (interval) {
              clearInterval(interval);
            }
            return 3;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      setSeconds(3);
    }

    if (interval && !open) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open, seconds]);

  return (
    <>
      {open && (
        <Portal name="toast-example">
          <View
            style={{ top: insets.top + 4 }}
            className="px-4 absolute w-full"
          >
            <ToastPrimitive.Root
              type="foreground"
              open={open}
              onOpenChange={setOpen}
              className="opacity-95 bg-secondary border-border flex-row justify-between items-center p-4 rounded-xl"
            >
              <View className="gap-1.5">
                <ToastPrimitive.Title className="text-foreground text-3xl">
                  {title}
                </ToastPrimitive.Title>
                <ToastPrimitive.Description className="text-foreground text-lg">
                  {message}
                </ToastPrimitive.Description>
              </View>
              <View className="items-end justify-end flex-1">
                {/* <ToastPrimitive.Action>
                  <Button onPress={() => setOpen(false)} variant={"outline"}>
                    <Text className="text-foreground">Action</Text>
                  </Button>
                </ToastPrimitive.Action> */}
                <ToastPrimitive.Close>
                  <Button onPress={() => setOpen(false)} variant={"outline"}>
                    <Text className="text-foreground">{t`Close`}</Text>
                  </Button>
                </ToastPrimitive.Close>
              </View>
            </ToastPrimitive.Root>
          </View>
        </Portal>
      )}
    </>
  );
}
