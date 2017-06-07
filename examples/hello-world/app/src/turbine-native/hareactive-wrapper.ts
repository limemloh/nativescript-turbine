import { producerStream, Stream, producerBehavior, Behavior } from "@funkia/hareactive";
import { Observable, EventData } from "data/observable";
import { View } from "ui/core/view";


export function streamFromObservable<A>(observable: Observable, event: string, extractor: (a: EventData) => A): Stream<A> {
  return producerStream<A>(push => {
    const handler = (e) => {
      push(extractor(e.value));
    };
    observable.on(event, handler);
    return () => {observable.off(event, handler)};
  });
}

export function behaviorFromObservable<A>(observable: any, property: string, initial: A, extractor: (e: EventData) => A): Behavior<A> {
  const model = new Observable();
  observable.bind({
    sourceProperty: property,
    targetProperty: property,
    twoWay: true
  }, model);
  return producerBehavior<A>(push => {
    const handler = (e) => {
      if (property === e.propertyName) {
        push(extractor(e.value));
      }
    };
    model.on(Observable.propertyChangeEvent, handler);
    return () => {observable.off(Observable.propertyChangeEvent, handler)};
  }, initial);
}
